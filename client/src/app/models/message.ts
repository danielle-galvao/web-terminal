import { AuthenticationMessage, ClientAuthenticationMessage, ServerAuthenticationMessage } from './authentication-message';
import { CommandMessage, ClientCommandMessage, ServerCommandMessage } from './command-message';
import { UpdateMessage, ClientUpdateMessage, ServerUpdateMessage } from './update-message';

export type ClientMessage = ClientAuthenticationMessage | ClientCommandMessage | ClientUpdateMessage;

export type ServerMessage = ServerAuthenticationMessage | ServerCommandMessage | ServerUpdateMessage;

export type Message = AuthenticationMessage | CommandMessage | UpdateMessage;