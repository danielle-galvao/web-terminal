#!/usr/bin/env python3

import queue
import subprocess
import sys
import threading

# Thread

def enqueue_output(stream, queue):
    ''' Read from stream and put line in queue '''
    for line in iter(stream.readline, b''):
        queue.put(line)
    stream.close()

# Start background shell process

shell_process = subprocess.Popen(
        ['/bin/sh'], 
        stdin  = subprocess.PIPE,
        stdout = subprocess.PIPE
)

# Start background shell thread (stdout)

shell_output_queue  = queue.Queue()
shell_output_thread = threading.Thread(
        target = enqueue_output, 
        args   = (shell_process.stdout, shell_output_queue),
        daemon = True
)
shell_output_thread.start()

# REPL

while True:
    # Read input
    sys.stdout.write('>>> ')
    sys.stdout.flush()
    line = sys.stdin.readline()

    # Send input to shell process
    shell_process.stdin.write(line.encode())
    shell_process.stdin.flush()
    
    # Read output
    block = True 
    while True:
        try:
            line = shell_output_queue.get(block, timeout=1)
        except queue.Empty:
            break
        else:
            sys.stdout.write(line.decode())
            sys.stdout.flush()
        block = False
