import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {map, Observable} from 'rxjs';
import { Trip } from "./trip.model";
import firebase from "firebase/compat";
import DocumentReference = firebase.firestore.DocumentReference;

// Update the path accordingly

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private db: AngularFirestore) {}

  getTrips(): Observable<Trip[]> {
  return this.db.collection<Trip>('Trips').snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as Trip;
      data.id = a.payload.doc.id;
      return { ...data };
    }))
  );
}

  addTrip(trip: Trip): Promise<DocumentReference<unknown>> {
    return this.db.collection('Trips').add(trip);
  }

  updateTrip(tripId: string, data: Partial<Trip>): Promise<void> {
    return this.db.doc(`Trips/${tripId}`).update(data);
  }

  deleteTrip(tripId: string): Promise<void> {
    return this.db.doc(`Trips/${tripId}`).delete();
  }
}
