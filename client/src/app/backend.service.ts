import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private hasAuthenticated: boolean;

  constructor() { }

  isAuthenticated() {
    console.log('Check something');
    return this.hasAuthenticated;
  }

  authenticate(token: string): Observable<boolean> {
    console.log('Submitting token ' + token + ' to backend');
    this.hasAuthenticated = true;
    return of(true);
  }
}
