import queue, subprocess, sys, threading, os
import asyncio, websockets
import json

from .server import token
from .sugar import sugar, handle_command, ls_to_html

authenticated = set()

async def recv_connection(websocket, path, token):
    async for message in websocket:
        await recv_message(websocket, message, token)
    try:
        authenticated.remove(websocket)
    except:
        pass

async def recv_message(websocket, message, token):
    print(f'< {message}')
    message_json = json.loads(message)

    if message_json["type"] == "authentication":
        print(token())
        out = None
        if message_json['payload']['token'] == token():
            authenticated.add(websocket)
            await websocket.send('{"type": "authentication", "payload": {"result": "ok"}}')
        else:
            await websocket.send('{"type": "authentication", "payload": {"result": "error", "message": "Wrong token"}}')

    elif message_json["type"] == "command":
        if websocket not in authenticated:
            STDOUT_JSON = '{"type": "command", "payload": {"result": "error", "message": "Not authenticated"}}'
            STDOUT_JSON = json.loads(STDOUT_JSON)

            STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']

            await websocket.send(json.dumps(STDOUT_JSON))
        else:
            await run_command(websocket, message_json)

async def write_message(websocket, message):
    print(f'> {message}')
    await websocket.send(message)

async def run_command(websocket, message_json):
    cmd = message_json['payload']['command']
    STDOUT_JSON = '{"type": "command", "payload": { "result": "ok", "serverId": -1 }}'
    STDOUT_JSON = json.loads(STDOUT_JSON)
    STDOUT_JSON['payload']['command'] = message_json['payload']['command']
    STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']


    await write_message(websocket, json.dumps(STDOUT_JSON))

    if cmd.split()[0] in sugar:
        await write_message(websocket, handle_command(STDOUT_JSON))
    else:
        await write_to_shell(cmd, websocket, message_json['payload']['clientId'])

def enqueue_output(stream, queue):
    ''' Read from stream and put line in queue '''
    for line in iter(stream.readline, b''):
        queue.put(line)
    stream.close()

async def write_to_shell(STDIN, websocket, client_id):
    global shell_process
    global shell_stdout_queue
    global shell_stderr_queue

    print(f'Sending STDIN:"{STDIN}" to shell proc...')

    shell_process.stdin.write(STDIN.encode() + b'; echo "$?:OHGODYES"')
    shell_process.stdin.write(b'\n')
    shell_process.stdin.flush()

    # Read output
    block = True
    while True:
        try:
            new_stderr = shell_stderr_queue.get(block, timeout=1)
        except queue.Empty:
            pass
        else:
            STDERR = new_stderr.decode()
            STDERR_JSON = '{"type": "update", "payload": {"output": {}}}'
            STDERR_JSON = json.loads(STDERR_JSON)
            STDERR = STDERR.replace('\n', '<br>')
            STDERR_JSON["payload"]["output"]["stderr"] = STDERR
            STDERR_JSON['payload']['clientId'] = client_id

            await write_message(websocket, json.dumps(STDERR_JSON))

        try:
            new_stdout = shell_stdout_queue.get(block, timeout=1)

            if 'OHGODYES\n' in new_stdout.decode():
                STDOUT = new_stdout.decode().split(':')[0]
                STDOUT_JSON = '{"type": "done", "payload": {"output": {}}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)
                STDOUT_JSON["payload"]["exitCode"] = STDOUT
                STDOUT_JSON['payload']['clientId'] = client_id
                await write_message(websocket, json.dumps(STDOUT_JSON))
                break
        except queue.Empty:
            pass
        else:
            STDOUT = new_stdout.decode()
            STDOUT_JSON = '{"type": "update", "payload": {"output": {}}}'
            STDOUT_JSON = json.loads(STDOUT_JSON)

            if 'ls' == STDIN.split()[0]:
                STDOUT = ls_to_html(STDOUT)
            STDOUT = STDOUT.replace('\n', '<br>')

            # STDOUT_JSON["payload"]["output"]["combined"] = STDOUT
            STDOUT_JSON["payload"]["output"]["stdout"] = STDOUT
            STDOUT_JSON['payload']['clientId'] = client_id

            await write_message(websocket, json.dumps(STDOUT_JSON))

        block = False

print('Starting shell process...')
shell_process = subprocess.Popen(
    ['bash'],
    shell=True,
    stdin  = subprocess.PIPE,
    stderr = subprocess.PIPE,
    stdout = subprocess.PIPE,
    env = os.environ
)

shell_stdout_queue  = queue.Queue()
shell_stdout_thread = threading.Thread(
        target = enqueue_output,
        args   = (shell_process.stdout, shell_stdout_queue),
        daemon = True
)

shell_stderr_queue  = queue.Queue()
shell_stderr_thread = threading.Thread(
        target = enqueue_output,
        args   = (shell_process.stderr, shell_stderr_queue),
        daemon = True
)

shell_stdout_thread.start()
shell_stderr_thread.start()
