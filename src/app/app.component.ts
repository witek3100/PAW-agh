import {Component, inject, OnDestroy} from '@angular/core';
import { Auth, User, user } from "@angular/fire/auth";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription

  constructor() {
    this.userSubscription = this.user$.subscribe((user: User | null) => {

    })
  }

  title = 'PawProjectApp';

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  signOut() {
    return this.auth.signOut();
  }

  protected readonly user = user;
}
