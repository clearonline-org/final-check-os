import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PrivateRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    console.log('Private guard');


    console.log('PrivateRouteGuard: Checking if the user is already authenticated');
    return this.auth.getSession()
      .then(session => {
        if (!session) {
          console.log(`App: No session found ${new Date()}`);
          // not logged in
          this.router.navigate(['/login']);
        }
        console.log(`App: Session is ${session}`, session);
        return !!session; // logged in
      })
      .catch(e => {
        console.error(`App: No session found ${e.message}`);
        // same as not logged in
          this.router.navigate(['/login']);
        return false;
      });


  }

  canActivateChild( next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    console.log('checking child route access');
    return this.auth.getSession().then(session => !!session).catch(() => false);
  }


}
