import asyncio
import websockets

async def sendHello():
    uri = 'ws://localhost:6969'

    async with websockets.connect(uri) as websocket:
        STDIN = input("$> ")
        await websocket.send(STDIN)
        print(f'> {STDIN}')

        STDOUT = await websocket.recv()
        print(f'< {STDOUT}')

asyncio.get_event_loop().run_until_complete(sendHello())
