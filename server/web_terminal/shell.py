import queue, subprocess, sys, threading, os
import asyncio, websockets
import json

import psutil

from .server import token
from .sugar import sugar, handle_command, ls_to_html

authenticated = set()

async def recv_connection(websocket, path, token):
    consumer_task = asyncio.ensure_future(
        consumer_handler(websocket, path, token))
    producer_task = asyncio.ensure_future(
        producer_handler(websocket, path))
    done, pending = await asyncio.wait(
        [consumer_task, producer_task],
        return_when=asyncio.FIRST_COMPLETED,
    )
    for task in pending:
        task.cancel()
    try:
        authenticated.remove(websocket)
    except:
        pass #user was never authenticated

async def consumer_handler(websocket, path, token):
    async for message in websocket:
        print(f'< {message}')
        await process_message(message, token, websocket)

async def producer_handler(websocket, path):
    while True:
        message = await websocket_queue.get()
        print(f'> {message}')
        await websocket.send(message)

async def process_message(message, token, websocket):
    message_json = json.loads(message)

    if message_json["type"] == "authentication":
        print(token())
        out = None
        if message_json['payload']['token'] == token():
            authenticated.add(websocket)
            await websocket_queue.put('{"type": "authentication", "payload": {"result": "ok"}}')
        else:
            await websocket_queue.put('{"type": "authentication", "payload": {"result": "error", "message": "Wrong token"}}')

    elif message_json["type"] == "command":
        if websocket not in authenticated:
            STDOUT_JSON = '{"type": "command", "payload": {"result": "error", "message": "Not authenticated"}}'
            STDOUT_JSON = json.loads(STDOUT_JSON)

            STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']

            await websocket_queue.put(json.dumps(STDOUT_JSON))
        else:
            await run_command(message_json)

    elif message_json["type"] == "update":
        if websocket not in authenticated:
            STDOUT_JSON = '{"type": "update", "payload": {"result": "error", "message": "Not authenticated"}}'
            STDOUT_JSON = json.loads(STDOUT_JSON)

            STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']

            await websocket_queue.put(json.dumps(STDOUT_JSON))
        else:
            payload = message_json['payload']
            if payload['type'] == 'signal':
                await send_signal(payload['signal'])
            else:
                STDOUT_JSON = '{"type": "update", "payload": {"result": "error", "message": "Unknown operation"}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)

                STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']

                await websocket_queue.put(json.dumps(STDOUT_JSON))

async def run_command(message_json):
    cmd = message_json['payload']['command']
    STDOUT_JSON = '{"type": "command", "payload": { "result": "ok", "status": "running" }}'
    STDOUT_JSON = json.loads(STDOUT_JSON)
    STDOUT_JSON['payload']['command'] = message_json['payload']['command']
    STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']


    await websocket_queue.put(json.dumps(STDOUT_JSON))

    if cmd.split()[0] in sugar:
        await websocket_queue.put(handle_command(STDOUT_JSON))
    else:
        asyncio.ensure_future(write_to_shell(cmd, message_json['payload']['clientId']))

def enqueue_output(stream, queue):
    ''' Read from stream and put line in queue '''
    for line in iter(stream.readline, b''):
        shell_shared_queue.put(True)
        queue.put(line)
    stream.close()

async def send_signal(signal):
     # TODO better way to do this?
    parent = None
    try:
        parent = psutil.Process(shell_process.pid)
    except psutil.NoSuchProcess:
        return
    children = parent.children(recursive=True)
    for process in children:
        if process.name is not 'bash':
            process.send_signal(signal)

async def write_to_shell(STDIN, client_id):
    global shell_process
    global shell_stdout_queue
    global shell_stderr_queue

    print(f'Sending STDIN:"{STDIN}" to shell proc...')

    shell_process.stdin.write(STDIN.encode() + b'; echo "$?:OHGODYES"')
    shell_process.stdin.write(b'\n')
    shell_process.stdin.flush()

    # Read output
    while True:
        await asyncio.get_event_loop().run_in_executor(None, lambda: shell_shared_queue.get())
        try:
            new_stderr = shell_stderr_queue.get(False)
        except queue.Empty:
            pass
        else:
            STDERR = new_stderr.decode()
            STDERR_JSON = '{"type": "update", "payload": {"output": {}, "status": "running"}}'
            STDERR_JSON = json.loads(STDERR_JSON)
            STDERR = STDERR.replace('\n', '<br>')
            STDERR_JSON["payload"]["output"]["stderr"] = STDERR
            STDERR_JSON['payload']['clientId'] = client_id

            await websocket_queue.put(json.dumps(STDERR_JSON))

        try:
            new_stdout = shell_stdout_queue.get(False)
        except queue.Empty:
            pass
        else:
            if 'OHGODYES\n' in new_stdout.decode():
                STDOUT = new_stdout.decode().split(':')[0]
                STDOUT_JSON = '{"type": "update", "payload": {"status": "completed"}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)
                STDOUT_JSON["payload"]["exitCode"] = STDOUT
                STDOUT_JSON['payload']['clientId'] = client_id
                await websocket_queue.put(json.dumps(STDOUT_JSON))
                break
            else:
                STDOUT = new_stdout.decode()
                STDOUT_JSON = '{"type": "update", "payload": {"output": {}, "status": "running"}}'
                STDOUT_JSON = json.loads(STDOUT_JSON)

                if 'ls' == STDIN.split()[0]:
                    STDOUT = ls_to_html(STDOUT)
                STDOUT = STDOUT.replace('\n', '<br>')

                # STDOUT_JSON["payload"]["output"]["combined"] = STDOUT
                STDOUT_JSON["payload"]["output"]["stdout"] = STDOUT
                STDOUT_JSON['payload']['clientId'] = client_id

                await websocket_queue.put(json.dumps(STDOUT_JSON))

print('Starting shell process...')
shell_process = subprocess.Popen(
    ['bash'],
    shell=True,
    stdin  = subprocess.PIPE,
    stderr = subprocess.PIPE,
    stdout = subprocess.PIPE,
    env = os.environ
)

websocket_queue  = asyncio.Queue()


shell_shared_queue  = queue.Queue()

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
