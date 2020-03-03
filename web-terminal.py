#!/usr/bin/env python3

import queue, subprocess, sys, threading

import asyncio, websockets

import json

def ls_to_html(STDOUT):
    toParse = STDOUT.splitlines()
    endParse = []

    for f in toParse:
        if '.' in f:
            fType = f.split('.')[-1]
            if fType in ['jpg', 'png', 'jpeg']:
                endParse.append(f'<img src="{f}">')
                continue
        endParse.append(f'<a href="{f}">{f}</a>')

    return '\n'.join(endParse)

token = "token" if len(sys.argv) <= 1 else sys.argv[1]
authenticated = set()

async def recCommand(websocket, path):
    while True:
        STDIN = await websocket.recv()
        print(f'< {STDIN}')
        STDIN_JSON = json.loads(STDIN)

        if STDIN_JSON["type"] == "authentication":
            out = None
            if STDIN_JSON['payload']['token'] == token:
                authenticated.add(websocket) # need to clean up authenticated
                await websocket.send('{"type": "authentication", "payload": {"result": "ok"}}')
            else:
                await websocket.send('{"type": "authentication", "payload": {"result": "error", "message": "Wrong token"}}')

        elif STDIN_JSON["type"] == "command":
            if websocket not in authenticated:
                STDOUT_JSON = '{"type": "command", "payload": {"result": "error", "message": "Not authenticated"}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)

                STDOUT_JSON['payload']['clientId'] = STDIN_JSON['payload']['clientId']

                await websocket.send(json.dumps(STDOUT_JSON))
            else:
                cmd = STDIN_JSON['payload']['command']

                STDOUT = await writeToShell(cmd)
                
                STDOUT_JSON = '{"type": "update", "payload": {"output": "NONE"}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)

                if 'ls' == cmd:
                    STDOUT = ls_to_html(STDOUT)

                STDOUT_JSON["payload"]["output"] = STDOUT

                print(f'> {json.dumps(STDOUT_JSON)}')

                await websocket.send(json.dumps(STDOUT_JSON))

def enqueue_output(stream, queue):
    ''' Read from stream and put line in queue '''
    for line in iter(stream.readline, b''):
        queue.put(line)
    stream.close()

print('Starting shell process...')
shell_process = subprocess.Popen(
        ['/bin/bash'], 
        stdin  = subprocess.PIPE,
        stdout = subprocess.PIPE
)

shell_output_queue  = queue.Queue()
shell_output_thread = threading.Thread(
        target = enqueue_output, 
        args   = (shell_process.stdout, shell_output_queue),
        daemon = True
)
shell_output_thread.start()
    
print(shell_output_queue)

async def writeToShell(STDIN):
    global shell_process
    global shell_output_queue

    print(shell_process)
    print(shell_output_queue)
    print(f'Sending STDIN:"{STDIN}" to shell proc...')
    shell_process.stdin.write(STDIN.encode())
    shell_process.stdin.write(b'\n')
    shell_process.stdin.flush()

    STDOUT = ''
    # Read output
    block = True 
    while True:
        try:
            line = shell_output_queue.get(block, timeout=1)
        except queue.Empty:
            break
        else:
            STDOUT += line.decode()
        block = False

    return STDOUT

from flask import Flask, send_from_directory

app = Flask(__name__)

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
  return send_from_directory('./client/dist/web-terminal/', path)

@app.route('/')
def root():
  return send_from_directory('./client/dist/web-terminal/', 'index.html')

def runFlask():
    print('Starting web server...')
    app.run()

if __name__ == '__main__':
    web_server_thread = threading.Thread(
            target = runFlask, 
            daemon = True
    )
    web_server_thread.start()
 
    print('Starting sockets...')
    start_server = websockets.serve(recCommand, 'localhost', 6969)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
