import webview as wv

class Api():
    def commandEntered(self, item):
        print(f'ITEM: {item}')

    def popUp(self, url):
        wv.create_window('manPage', url, width=400, height=300, resizable=True)
        wv.start()

if __name__ == '__main__':
    api = Api()
    wv.create_window('htmlTerm', './index.html', js_api=api, frameless=False, text_select=True)
    wv.start()
