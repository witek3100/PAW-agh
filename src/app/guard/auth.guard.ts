import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route,
  mapToCanActivate
} from '@angular/router';
import {map, Observable, switchMap} from 'rxjs';
import {Auth, user, User} from '@angular/fire/auth'
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UserService} from "../user.service";
import {UserData} from "../user.model";
import { of } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class AdminGuard {

  constructor(private db: AngularFirestore, protected userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return of(false);
        }

        const userID = user.uid;
        return this.db.collection('Users').doc<UserData>(userID).get().pipe(
          map((ss) => {
            const userData = ss.data();
            if (userData && userData.IsAdmin) {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          })
        );
      })
    );
  }
}


@Injectable({
 providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private db: AngularFirestore, protected userService: UserService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return of(false);
        }

        const userID = user.uid;
        return this.db.collection('Users').doc<UserData>(userID).get().pipe(
          map((ss) => {
            const userData = ss.data();
            if (userData && userData.IsVerified) {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          })
        );
      })
    );
  }
}


@Injectable({
 providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(private db: AngularFirestore, protected userService: UserService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return of(false);
        }

        const userID = user.uid;
        return this.db.collection('Users').doc<UserData>(userID).get().pipe(
          map((ss) => {
            const userData = ss.data();
            if (userData && userData.IsManager) {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          })
        );
      })
    );
  }
}


@Injectable({
 providedIn: 'root'
})
export class AdminOrManagerGuard implements CanActivate {
  constructor(private db: AngularFirestore, protected userService: UserService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.userService.user$.pipe(
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/']);
          return of(false);
        }

        const userID = user.uid;
        return this.db.collection('Users').doc<UserData>(userID).get().pipe(
          map((ss) => {
            const userData = ss.data();
            if (userData && (userData.IsManager || userData.IsAdmin)) {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          })
        );
      })
    );
  }
}



const route: Route = {
  path: 'add-trip',
  canActivate: [AdminGuard, UserGuard, ManagerGuard, AdminOrManagerGuard],
};



