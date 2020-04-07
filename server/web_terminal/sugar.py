sugar = ['notes']

def ls_to_html(STDOUT):
    toParse = STDOUT.splitlines()
    endParse = []

    STDOUT.strip()

    for f in toParse:
        if '.' in f:
            fType = f.split('.')[-1]
            if fType in ['jpg', 'png', 'jpeg']:
                endParse.append(f'<img src="/file/{f}">\n')
                continue
        endParse.append(f'<a href="/file/{f}">{f}</a>\n')

    # return '\n'.join(endParse)
    return ''.join(endParse)

def notes(op, data=None):
    if op == 'r':
        with open('./.notes', 'r') as i:
            data = i.read()
        return data
    elif op == 'w':
        with open('./.notes', 'w+') as o:
            o.write(data)

def handle_command(cmd_json):
    pass
