import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Injectable } from '@angular/core';
import { Message, ClientMessage, ServerMessage } from './models/message';
import { Subject, Observable, merge } from 'rxjs';

/**
 * This class provides various interfaces into the message flow between the client and the server.
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  /**
   * The client subject contains messages sent from inside the Angular application, and is where such messages should be submitted
   */
  public readonly client$: Subject<ClientMessage>;

  /**
   * This is the actual websocket connection
   */
  private websocket$: Subject<unknown>;

  /**
   * The server observable contains messages arriving from the server
   */
  public readonly server$: Observable<ServerMessage>;

  /**
   * The server observable contains all messages, from server or client
   */
  public readonly all$: Observable<Message>;

  constructor() {
    this.websocket$ = webSocket<unknown>('ws://localhost:6969');
    this.websocket$.subscribe(() => {}, (err) => console.error('Socket got error ', err), () => console.log('Socket completed')); //TODO better error

    this.client$ = new Subject();
    this.server$ = this.websocket$.asObservable() as Observable<ServerMessage>;

    this.client$.subscribe(message => this.websocket$.next(message));

    this.all$ = merge<Message>(this.client$, this.server$);
  }
}