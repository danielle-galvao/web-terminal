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
                endParse.append(f'<img src="/file/{f}">')
                continue
        endParse.append(f'<a href="/file/{f}">{f}</a>')

    return '\n'.join(endParse)

token = "token" if len(sys.argv) <= 1 else sys.argv[1]
authenticated = set()

async def recv_connection(websocket, path):
    async for message in websocket:
        await recv_message(websocket, message)
    try:
        authenticated.remove(websocket)
    except:
        pass

async def recv_message(websocket, message):
    print(f'< {message}')
    message_json = json.loads(message)

    if message_json["type"] == "authentication":
        out = None
        if message_json['payload']['token'] == token:
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
    await write_to_shell(cmd, websocket)

def enqueue_output(stream, queue):
    ''' Read from stream and put line in queue '''
    for line in iter(stream.readline, b''):
        queue.put(line)
    stream.close()

async def write_to_shell(STDIN, websocket):
    global shell_process
    global shell_stdout_queue
    global shell_stderr_queue

    print(f'Sending STDIN:"{STDIN}" to shell proc...')

    shell_process.stdin.write(STDIN.encode())
    shell_process.stdin.write(b'\n')
    shell_process.stdin.flush()

    # Read output
    block = True
    while True:
        try:
            new_stdout = shell_stdout_queue.get(block, timeout=1)
        except queue.Empty:
            break
        else:
            STDOUT = new_stdout.decode()
            STDOUT_JSON = '{"type": "update", "payload": {"output": {}}}'
            STDOUT_JSON = json.loads(STDOUT_JSON)

            if 'ls' == cmd:
                STDOUT = ls_to_html(STDOUT)

            STDOUT_JSON["payload"]["output"]["combined"] = STDOUT
            STDOUT_JSON["payload"]["output"]["stdout"] = STDOUT
            STDOUT_JSON['payload']['clientId'] = message_json['payload']['clientId']

            await write_message(websocket, json.dumps(STDOUT_JSON))

        block = False

print('Starting shell process...')
shell_process = subprocess.Popen(
        ['bash'],
        stdin  = subprocess.PIPE,
        stderr = subprocess.PIPE,
        stdout = subprocess.PIPE
)

shell_stdout_queue  = queue.Queue()
shell_stdout_thread = threading.Thread(
        target = enqueue_output,
        args   = (shell_process.stdout, shell_stdout_queue),
        daemon = True
)

# shell_stderr_queue  = queue.Queue()
# shell_stderr_thread = threading.Thread(
#         target = enqueue_output,
#         args   = (shell_process.stderr, shell_stderr_queue),
#         daemon = True
# )

shell_stdout_thread.start()
# shell_stderr_thread.start()
