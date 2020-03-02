import asyncio
import websockets
import json

async def sendHello():
    uri = 'ws://localhost:6969'

    async with websockets.connect(uri) as websocket:
        #STDIN = input("$> ")
        STDIN = '{"payload": {"command": "ls"}}'
        await websocket.send(STDIN)
        print(f'> {STDIN}')

        STDOUT = await websocket.recv()
        print('STDOUT', STDOUT)
        STDOUT = json.loads(STDOUT)
        print(f'< {STDOUT["payload"]["output"]}')

asyncio.get_event_loop().run_until_complete(sendHello())
