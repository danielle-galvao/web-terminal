from flask import Flask, send_from_directory, redirect
from random import choice
from string import ascii_uppercase

app = Flask(__name__)

token_val = ''

def token():
    global token_val

    if not token_val:
        token_val = ''.join(choice(ascii_uppercase) for i in range(5))

    return token_val

@app.route('/file/<path:path>', methods=['GET'])
def local_files(path):
    #TODO
    return send_from_directory('./', path)

@app.route('/terminal/<path:path>', methods=['GET'])
def angular_folders(path):
    try:
        return send_from_directory('./client/', path)
    except:
        return redirect('/', code=301)

@app.route('/terminal/')
def terminal_root():
        return send_from_directory('./client/', 'index.html')

@app.route('/<path:path>')
def catch_rest(path):
    return redirect('/terminal/', code=301)

@app.route('/')
def root():
    return redirect('/terminal/', code=301)

def run_flask():
    print(f'Starting web server, your token is: {token()}')

    app.run()
