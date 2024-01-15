import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth'

@Injectable({
 providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(public authService: Auth, public router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

    console.log(this.authService.currentUser)
    if (!this.authService.currentUser) {
      //
      // this.router.navigate(['login'])

    }

    return true;

  }
}
