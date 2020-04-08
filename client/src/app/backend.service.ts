import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError, Subject } from 'rxjs';
import { map, filter, shareReplay, scan, takeWhile, timeoutWith, take } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message, ServerMessage, ClientMessage } from './models/message';
import { WebSocketService } from './websocket.service';
import { Command } from './models/command';

const ofType = (type: string | string[]) => (Array.isArray(type)) ? filter(<T>(message: T) => type.indexOf(message["type"]) >= 0) : filter(<T>(message: T) => message["type"] == type);

const mapToPayload = map((message: Message) => message.payload);

const throwErrorMessage = map((message: unknown) => {
  if(message["result"] == "error") {
    throw message;
  }
  return message;
});

const isOk: OperatorFunction<any, boolean> = map(message => message["result"] == "ok");

/**
 * This service is responsible for handling communication with the backend
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private clientId = 0;

  private history$: Observable<Command[]>;
  private authenticated$: Observable<boolean>;

  constructor(private websocketProvider: WebSocketService) {
    this.authenticated$ = websocketProvider.server$.pipe(
      ofType("authentication"),
      mapToPayload,
      isOk,
      shareReplay(1),
    );
    // TODO dummy subscription actually needed? Possible to rewrite this nicer?
    this.authenticated$.subscribe(() => {});

    // TODO init here or upon construction?
    this.history$ = websocketProvider.all$.pipe(
      ofType(["command", "update"]),
      scan((history: Command[], message: Message) => {
        //TODO set pending based on input from client$
        if(message.type == "command" && 'result' in message.payload && message.payload.result == "ok") {
          history[message.payload.clientId] = {...history[message.payload.clientId], ...message.payload};
        } else if(message.type == "update" && 'output' in message.payload) {
          history[message.payload.clientId].output = (history[message.payload.clientId]?.output || {combined: '', stdout: '', stderr: ''});
          history[message.payload.clientId].output.stdout = (history[message.payload.clientId]?.output.stdout || '') + message.payload.output.stdout;
          history[message.payload.clientId].output.stderr = (history[message.payload.clientId]?.output.stderr || '') + message.payload.output.stderr;
        }
        return history;
      }, []),
      shareReplay(1));
      this.history$.subscribe(() => {});
   }

  /**
   * Returns an observable which indicates whether a message of successful authentication has been recieved
   */
  isAuthenticated() {
    return this.authenticated$;
  }

  /**
   * Checks the given token with the backend
   * @param token the token provided by the user to submit
   * @returns whether it was successful or not
   */
  authenticate(token: string) {
    console.log('Submitting token ' + token + ' to backend');
    const result: Observable<boolean> = this.websocketProvider.server$.pipe(
      ofType("authentication"),
      mapToPayload,
      throwErrorMessage,
      isOk,
      timeoutWith(1000, throwError({ message: "Timed out"})),
      take(1),
      shareReplay(1)
      // TODO link this timeout with the one in the router guard so they trigger at same time?
    );
    this.websocketProvider.client$.next({ type: "authentication", payload: { token }});
    return result;
  }

  /**
   * Returns a dynamic view into the history of the run commands - should be shared among all
   * @returns the past commands
   */
  getHistory(): Observable<Command[]> {
    return this.history$;
  }

  /**
   * Gets the information for a single command, which halts and closes when the command is marked as 'completed'
   * @param clientId the command to get the observable for
   */
  getHistoryFor(clientId: number) {
    return this.history$.pipe(
      map(commands => commands[clientId]),
      takeWhile(command => command["status"] == "running", true)
    );
  }

  /**
   * Sends a command to be run
   * @param command the command to send to the backend
   * @returns whether the command was accepted
   */
  sendCommand(command: any): Observable<boolean>  {
    console.log('Submitting command ' + command + ' to backend');
    const command$ = this.websocketProvider.server$.pipe(
      ofType("command"),
      throwErrorMessage,
      isOk
    );

    this.websocketProvider.client$.next({type: "command", payload: {
      command,
      clientId: this.clientId ++
    }});

    return command$;
  }

}