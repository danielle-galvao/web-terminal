
export interface ClientCommandPayload {
    command: string,
    clientId: number,
    breakpoints? : number[],
}

export interface ServerCommandSuccess {
    result: 'ok',
    command: string,
    clientId: number,
    serverId: number
}

export interface ServerCommandError {
    result: 'error',
    command: string,
    clientId: number,
    serverId: number
}

export type ClientCommandMessage = {
    type: 'command',
    payload: ClientCommandPayload,
};

export type ServerCommandMessage = {
    type: 'command',
    payload: ServerCommandSuccess | ServerCommandError,
};

export type CommandMessage = ClientCommandMessage | ServerCommandMessage;