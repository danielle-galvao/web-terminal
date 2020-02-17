import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * This service is responsible for handling communication with the backend
 */
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private hasAuthenticated: boolean;

  private subject = new Subject<any>();

  private id = 0;

  constructor() { }

  /**
   * Somehow checks if the user had been successfully authenticated - LocalStorage?
   */
  isAuthenticated() {
    // TODO
    console.log('Check that user has already successfully authenticated');
    return this.hasAuthenticated;
  }

  /**
   * Checks the given token with the backend
   * @param token the token provided by the user to submit
   * @returns whether it was successful or not
   */
  authenticate(token: string): Observable<boolean> {
    // TODO
    console.log('Submitting token ' + token + ' to backend');
    this.hasAuthenticated = true;

    return of(true);
  }

  /**
   * Returns a dynamic view into the history of the run commands - should be shared among all
   * @returns the past commands
   */
  getHistory(): Observable<any[]> {
    let history: any[] = [];
    return this.subject.pipe(map((event) => {
      history.push(event);
      return history;
    }), shareReplay());
  }
  
  /**
   * Sends a command to be run
   * @param command the command to send to the backend
   * @returns whether the command was accepted
   */
  sendCommand(command: any): Observable<boolean>  {
    console.log('Submitting command ' + command + ' to backend');
    // TODO replace fake results
    switch(command.split(' ')[0]) {
      case 'ls': {
        this.subject.next({
            id: this.id++,
            command,
            output: {
              stdin: "",
              stdout: "<a href=\"./bui.png\">bui.png</a>",
              stderr: ""
            },
            time: "0:69s"
        });
      }
      break;
      case 'echo': {
        this.subject.next({
            id: this.id++,
            command,
            output: {
              stdin: "",
              stdout: command.substring(command.indexOf(' ')),
              stderr: ""
            },
            time: "0.0s"
        });
      }
      break;
    }
    return of(true);
  }

}
