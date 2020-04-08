import { Injectable } from '@angular/core';
import { Subject, Observable, merge } from 'rxjs';
import { ClientMessage, ServerMessage, Message } from './models/message';
import { map } from 'rxjs/operators';

const setSource = (source: string) => map((msg: any) => ({ ...msg, source}));

/**
 * The Webservice mock prevents actually opening a websocket as the othe class would - causing an error in the Github CI action
 */
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public readonly client$: Subject<ClientMessage>;
  private websocket$: Subject<any>;
  public readonly server$: Observable<ServerMessage>;
  public readonly all$: Observable<Message>;

  constructor() {
    this.websocket$ = new Subject();
    this.client$ = new Subject();
    this.server$ = this.websocket$ as Observable<ServerMessage>;

    this.client$.subscribe(message => this.websocket$.next(message));

    this.all$ = merge<Message>(this.client$, this.server$);
  }
}