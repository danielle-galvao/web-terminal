#!/usr/bin/env python3

import queue, subprocess, sys, threading

import asyncio, websockets

async def recCommand(websocket, path):
    STDIN = await websocket.recv()
    print(f'< {STDIN}')

    STDOUT = await writeToShell(STDIN)
    print(f'> {STDOUT}')

    await websocket.send(STDOUT)

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

from flask import Flask, render_template

app = Flask(__name__, template_folder='./frontend/')

@app.route('/')
def login():
    return render_template('authenticate.html')

if __name__ == '__main__':
    #print('Starting web server...')
    #app.run()

    print('Starting sockets...')
    start_server = websockets.serve(recCommand, 'localhost', 6969)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
