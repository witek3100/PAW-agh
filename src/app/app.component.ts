import {Component, inject, OnDestroy} from '@angular/core';
import { Auth, User, user } from "@angular/fire/auth";
import {Subscription} from "rxjs";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { UserData } from "./user.model";
import {Trip} from "./trip.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription
  userData: UserData

  constructor(private db: AngularFirestore) {
    this.userSubscription = this.user$.subscribe((user: User | null) => {
      this.db.collection('Users').doc(user?.uid).get().subscribe(ss => {
        this.userData = ss.data() as UserData;
      })
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
