
# Web-Terminal Websocket Protocol v3:
### Discussion Points:
- Is it possible to use wss / https to a user’s host machine? What privacy implications are there? - https://jupyter-notebook.readthedocs.io/en/stable/public_server.html
- Better to use GraphQL technique?
- Thumbnails/inline images? - currently using inline images
- Rehydrate same user session?
- Buffer messages while disconnected?
## General Form:

Message data consists of (json-decoded):

```js
{
    type: "$TYPE",
    payload: { … }
}
```

### Authentication:

- Two way handshake? Might need to encrypt payload since ssl/wss might not be available

#### Client:
Sending the token the user provided:
```js
{
    type: "authentication",
    payload: {
        token: ""
    }
}
```

#### Server:
Wrong token:
```js
{
    type: "authentication",
    payload: {
        result: "error",
        message: "...message for user..."
    }
}
```

Returning session id:
```js
{
    type: "authentication",
    payload: {
        result: "ok",
        sessionToken: "..."
    }
}
```
### Commands:
#### Client:
Requesting command to be run:
```js
{
    type: "command",
    sessionToken: "",
    // might not be necessary to pass this along, but
    // server should make sure client is auth’d beforehand
    payload: {
        command: "echo",
        clientId: 1
    }
}
```
Requesting breakpoint:
```js
{
    type: "command",
    sessionToken: "",
    // might not be necessary to pass this along, but
    // server should make sure client is auth’d beforehand
    payload: {
        command: "ls | grep \"png\"",
        breakpoints: [0],
        // the indexes of the pipelines among all pipes
        clientId: 1
    }
}
```
#### Server:
Giving tracking id for that command:
```js
{
    type: "command",
    payload: {
        result: "ok",
        command: "echo",
        clientId: 1,
        serverId: 1
    }
}
```
### Updates
#### Client:
Sending stdin updates:
```js
{
    type: "update",
    sessionToken: "",
    payload: {
        type: "stdin",
        command: "",
        serverId: 1,
        input: ""
        // incremental
    }
}
```
Sending signal:
```js
{
    type: "update",
    sessionToken: "",
    payload: {
        type: "signal",
        command: "",
        serverId: 1,
        clientId: 1,
        signal: 15
    }
}
```
#### Server:
Sending stdout/stderr changes:
```js
{
    type: "update",
    payload: {
        command: "",
        serverId: 1,
        output: {
            // output is incremental
            combined: "<a href=\"./bui.png\">bui.png</a>",
            stdin: "<a  href=\"./bui.png\">bui.png</a>",
            stderr: ""
        },
        begin: "",
        // use ISO time
        end: "",
        status: "completed" || "running"
    }
}
```
  Output change with breakpoints:
```js
{
    type: "update",
    payload: {
        command: "",
        serverId: 1,
        output: {
            // incremental
            combined: "<a href=\"./bui.png\">bui.png</a>",
            stdin: "<a  href=\"./bui.png\">bui.png</a>",
            stderr: "",
            breakpoints: [
                {
                    location: 3,
                    combined: "",
                    stdout: "",
                    stderr: ""
                }
            ]
        },
        begin: "",
        // use ISO time
        end: "",
        status: "completed" || "running"
    }
}
```
### Notes?
### Preferences?
### Notifications:
Something on the backend changes