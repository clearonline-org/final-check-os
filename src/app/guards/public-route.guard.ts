import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class PublicRouteGuard implements CanActivate {
  constructor(
    public auth: AuthService,
        private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      console.log('Public guard');


    console.log('PublicRouteGuard: Checking if the user is already authenticated');
    return this.auth.getSession()
      .then(session => {
        if (session) {
          console.log(`App: No session found ${new Date()}`);
          // not logged in
            this.router.navigate(['/dashboard']);
        }
        console.log(`App: Session is ${session}`, session);
        return !session; // logged in
      })
      .catch((e: Error) => {
        console.error(`App: No session found ${e.message}`);
        console.log(e.stack);
        // same as not logged in
        return true;
      });



  }
}
