import json
from threading import Thread

class PyHandler:
    def __init__(self):
        self.commandQueue = []
        self.miscQueue = []

        self.outboundQueue = []

        self.commandHandlerThread = Thread(target=self.commandWatcher)
        self.miscHandlerThread = Thread(target=self.miscWatcher)

        self.commandThreadStop = False
        self.miscThreadStop = False

    def startThreads(self):
        self.commandHandlerThread.start()
        self.miscHandlerThread.start()

    def endThreads(self):
        self.commandThreadStop = True
        self.miscThreadStop = True

        self.commandHandlerThread.join()
        self.miscHandlerThread.join()

    def commandWatcher(self):
        def handleJson(j):
            return 1

        def runCommand(c):
            return 1

        while not self.commandThreadStop:
            if len(self.commandQueue) > 0:
                for j in self.commandQueue:
                    c = handleJson(j)
                    o = runCommand(c)
                    self.outboundQueue.append(o)

    def miscWatcher(self):
        pass