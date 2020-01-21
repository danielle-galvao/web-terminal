import webview as wv

class Api():
    def commandEntered(self, item):
        print(f'ITEM: {item}')

if __name__ == '__main__':
    api = Api()
    wv.create_window('htmlTerm', './index.html', js_api=api, frameless=True)
    wv.start()
