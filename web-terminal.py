from flask import Flask, render_template

app = Flask(__name__, template_folder='./frontend/')

@app.route('/')
def login():
    return render_template('authenticate.html')

if __name__ == '__main__':
    app.run()