import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BackendService } from './backend.service';

/**
 * Guard to make sure that users can only load certain pages if they have already authenticated with the server
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivateChild, CanLoad {
  constructor(private backend: BackendService){

  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    return this.backend.isAuthenticated();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    return this.backend.isAuthenticated();
  }
}
