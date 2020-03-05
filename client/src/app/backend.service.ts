import { Injectable } from '@angular/core';
import { Observable, OperatorFunction, throwError } from 'rxjs';
import { map, filter, shareReplay, scan, takeWhile, timeoutWith, take } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

const ofType = (type: string | string[]) => (Array.isArray(type)) ? filter((message) => type.indexOf(message["type"]) >= 0) : filter((message) => message["type"] == type);

const mapToPayload = map((message: unknown) => message["payload"]);

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

  private websocket;

  private clientId = 0;

  history$;
  authenticated$: Observable<boolean>;

  constructor() {
    this.websocket = webSocket("ws://localhost:6969");
    this.websocket.subscribe(() => {}, (err) => console.error('Socket got error ', err), () => console.log('Socket completed')); //TODO better error

    this.authenticated$ = this.websocket.pipe(
      ofType("authentication"),
      mapToPayload,
      isOk,
      shareReplay(1),
    );
    // TODO dummy subscription actually needed? Possible to rewrite this nicer?
    this.authenticated$.subscribe(() => {});

    // TODO init here or upon construction?
    this.history$ = this.websocket.pipe(
      ofType(["command", "update"]),
      scan((history, message: any) => {
        if(message.type == "command" && message.payload.result == "ok") {
          history[message.payload.clientId] = {...history[message.payload.clientId], ...message.payload};
        } else if(message.type == "update") {
          history[message.payload.clientId].output = (history[message.payload.clientId]?.output || '') + message.payload.output.stdout;
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
    const result: Observable<boolean> = this.websocket.pipe(
      ofType("authentication"),
      mapToPayload,
      throwErrorMessage,
      isOk,
      timeoutWith(1000, throwError({ message: "Timed out"})),
      take(1),
      shareReplay(1)
      // TODO link this timeout with the one in the router guard so they trigger at same time?
    );
    this.websocket.next({type: "authentication", payload: {token}});
    return result;
  }

  /**
   * Returns a dynamic view into the history of the run commands - should be shared among all
   * @returns the past commands
   */
  getHistory(): Observable<any[]> {
    return this.history$;
  }

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
    const command$ = this.websocket.pipe(
      ofType("command"),
      throwErrorMessage,
      isOk
    );

    this.websocket.next({type: "command", payload: {
      command,
      clientId: this.clientId ++
    }});

    return command$;
  }

}
