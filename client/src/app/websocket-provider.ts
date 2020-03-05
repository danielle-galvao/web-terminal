import { webSocket } from "rxjs/webSocket";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketProvider {
  provide() {
    return webSocket('ws://localhost:6969');
  }
}