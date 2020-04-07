#!/usr/bin/env python3

import threading, websockets, asyncio, functools
from .server import run_flask, token
from .shell import recv_connection
import time

def start():
    web_server_thread = threading.Thread(
            target = run_flask,
            daemon = True
    )
    web_server_thread.start()

    print('Starting sockets...')
    # print(server.token)

    func_args = functools.partial(recv_connection, token=token)

    start_server = websockets.serve(func_args, 'localhost', 6969)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

if __name__ == '__main__':
    start()