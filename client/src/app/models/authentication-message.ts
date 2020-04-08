export interface ClientAuthenticationPayload {
    token: string,
}

export interface ServerAuthenticationError {
    result: 'error',
    message: ''
}

export interface ServerAuthenticationSuccess {
    result: 'ok',
    sessionToken: string
}

export type ClientAuthenticationMessage = {
    type: 'authentication',
    payload: ClientAuthenticationPayload,
};

export type ServerAuthenticationMessage = {
    type: 'authentication',
    payload: ServerAuthenticationError | ServerAuthenticationSuccess,
};

export type AuthenticationMessage = ClientAuthenticationMessage | ServerAuthenticationMessage;