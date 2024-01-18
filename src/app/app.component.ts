import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Auth, User, user } from "@angular/fire/auth";
import {Subscription} from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UserData } from "./user.model";
import {Trip} from "./trip.model";
import { UserService } from "./user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription
  userData: UserData;

  constructor(private db: AngularFirestore, protected userService: UserService, private router: Router) {

  }

  title = 'PawProjectApp';

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  signOut() {
    this.router.navigate(['login'])
    return this.auth.signOut();
  }

  protected readonly user = user;

  ngOnInit(): void {

  }
}
