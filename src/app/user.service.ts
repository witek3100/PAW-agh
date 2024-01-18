import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {Auth, User, user} from "@angular/fire/auth";
import {BehaviorSubject, map, Observable, Subscription} from 'rxjs';
import { UserData } from "./user.model";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userDataSubject: BehaviorSubject<UserData | null> = new BehaviorSubject<UserData | null>(null);
  userSubscription: Subscription
  userData: UserData
  user$ = user(this.auth);

  constructor(private auth: Auth, private db: AngularFirestore) {
    this.userSubscription = this.user$.subscribe((user: User | null) => {
      this.db.collection('Users').doc(user?.uid).get().subscribe(ss => {
        this.userData = ss.data() as UserData;
      })
    })
  }

  getUsers(): Observable<UserData[]> {
    return this.db.collection<UserData>('Users').snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as UserData;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    })
  );
  }

  updateUser(user_id: string, user: Partial<UserData>): Promise<void> {
    return this.db.doc(`Users/${user_id}`).update(user);
  }

  deleteUser(userId: string): Promise<void> {
    return this.db.doc(`Users/${userId}`).delete();
  }

}
