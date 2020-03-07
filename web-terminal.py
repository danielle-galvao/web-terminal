#!/usr/bin/env python3

import threading, websockets, asyncio
from server import run_flask
from shell import recv_connection

if __name__ == '__main__':
    web_server_thread = threading.Thread(
            target = run_flask,
            daemon = True
    )
    web_server_thread.start()

    print('Starting sockets...')
    start_server = websockets.serve(recv_connection, 'localhost', 6969)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
