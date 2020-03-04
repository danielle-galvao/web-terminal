
from flask import Flask, send_from_directory, redirect

app = Flask(__name__)

@app.route('/file/<path:path>', methods=['GET'])
def local_files(path):
    return send_from_directory('./', path)

@app.route('/terminal/<path:path>', methods=['GET'])
def angular_folders(path):
    try:
        return send_from_directory('./client/dist/web-terminal/', path)
    except:
        return redirect('/', code=301)

@app.route('/terminal')
def terminal_root():
        return send_from_directory('./client/dist/web-terminal/', 'index.html')

@app.route('/')
def root():
    return redirect('/terminal', code=301)

def run_flask():
    print('Starting web server...')
    app.run()
