import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BackendService } from './backend.service';
import { tap, timeoutWith, take } from 'rxjs/operators';

/**
 * Guard to make sure that users can only load certain pages if they have already authenticated with the server
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {
  constructor(private backend: BackendService, private router: Router){

  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.backend.isAuthenticated().pipe(
        timeoutWith(1000, of(false)),
        take(1),
        tap(isAuthenticated => { if(!isAuthenticated) this.router.navigateByUrl('/') }));
  }
}
