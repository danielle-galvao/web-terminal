const WebSocket = require('ws');

const token = process.argv[2] || "token";

console.log('Token is "%s"', token);

const wss = new WebSocket.Server({ port: 8888 });
const commands = [];
wss.on('connection', function connection(ws) {
  let authenticated = false;
  ws.on('message', function incoming(message) {
    data = JSON.parse(message);
    type = data.type;
    payload = data.payload;
    console.log('received: %s', JSON.stringify(payload));
    
    if(type == "authentication") {
      recievedToken = payload.token;
      console.log('Received auth token "%s"', recievedToken);
      if(recievedToken != token) {
        ws.send(JSON.stringify({ type, payload: { result: "error", message: "Invalid" }}));
      } else {
        ws.send(JSON.stringify({ type, payload: { result: "ok", sessionToken: null }}));
        authenticated = true;
      }
    }
    if(!authenticated) {
      ws.send(JSON.stringify({ type, payload: { result: "error", message: "Not authenticated" }}));
    }
    switch(type) {
      case "command": {
        command = payload.command;
        clientId = payload.clientId;
        serverId = commands.push({command, clientId});
        ws.send(JSON.stringify({ type, payload: { result: "ok", command, clientId, serverId }}));
        
        if(command == "loop") {
          setInterval(({command, clientId, serverId}) => {
            ws.send(JSON.stringify({ type: 'update', payload: { result: 'ok', command, clientId, serverId, output: {combined: 'foo\nbar\n', stdout:'foo\n', stderr: 'bar\n'}, time: '1000+ms', state: 'running' }}));
          }, 2000, {command, clientId, serverId});
        } else if(command == "wait") {
          setTimeout(({command, clientId, serverId}) => {
            ws.send(JSON.stringify({ type: 'update', payload: { result: 'ok', command, clientId, serverId, output: {combined: 'foo\nbar\n', stdout:'foo\n', stderr: 'bar\n'}, time: '1000ms', state: 'completed' }}));
          }, 2000, {command, clientId, serverId});
        } else if(command.split(" ", 1)[0] == "echo") {
          ws.send(JSON.stringify({ type: 'update', payload: { result: 'ok', command, clientId, serverId, output: {combined: command.slice(command.indexOf(' ')), stdout: command.slice(command.indexOf(' ')), stderr: ''}, time: '0ms', state: 'completed' }}));
        } else if(command == "ls") {
          ws.send(JSON.stringify({ type: 'update', payload: { result: 'ok', command, clientId, serverId, output: {combined: '<img id="bui" src="../assets/bui.png" width="130" height="200"/>', stdout: '<img id="bui" src="../assets/bui.png" width="130" height="200"/>', stderr: ''}, time: '0ms', state: 'completed' }}));
        }
      }
      break;
      case "update": {
        if(command == "cat") {
          content = payload.input;
          ws.send(JSON.stringify({ type: 'update', payload: { result: 'ok', command, clientId, serverId, output: {combined: content, stdout: content, stderr: ''}, time: null, state: 'running' }}));
        }
      }
      break;
    }
  });
});