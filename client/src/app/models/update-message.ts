

export interface ClientInputUpdatePayload {
    type: 'stdin',
    command: string,
    clientId: number,
    serverId: number,
    input: string
}

export interface ClientSignalUpdatePayload {
    type: 'signal',
    command: string,
    serverId: number,
    clientId: number,
    signal: number
}

export interface ServerOutputUpdatePayload {
    command: string,
    clientId: number,
    serverId: number,
    output: {
        combined: string,
        stdout: string,
        stderr: string,
        breakpoints? : {
            location: string,
            combined: string,
            stdout: string,
            stderr: string
        }[]
    },
    begin: string,
    end: string,
    status: 'completed' | 'running'
}

export type ClientUpdateMessage = {
    type: 'update',
    payload: ClientInputUpdatePayload | ClientSignalUpdatePayload;
};

export type ServerUpdateMessage = {
    type: 'update',
    payload: ServerOutputUpdatePayload;
};

export type UpdateMessage = {
    type: 'update',
    payload: ClientInputUpdatePayload | ClientSignalUpdatePayload | ServerOutputUpdatePayload;
};