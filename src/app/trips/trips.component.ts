import { Component, OnInit } from "@angular/core";
import { Trip } from '../trip.model'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from '@angular/router';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})

export class TripsComponent implements OnInit {
  public trips: any[] = [];

  public constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router) {}
  public ngOnInit(): void {
    this.db.collection('Trips').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const trip = doc.data() as {};
        Object.assign(trip, {'id': doc.id})
        this.trips.push(trip)
      })
    })

  }

  getBorderStyle(trip: Trip): { [key: string]: string } {
    if (trip.Price === Math.min(...this.trips.map((t: Trip) => t.Price))) {
      return { 'border': '4px solid green' };
    } else if (trip.Price === Math.max(...this.trips.map((t: Trip) => t.Price))) {
      return { 'border': '4px solid red' };
    } else {
      return {};
    }
    return {};
  }

  deleteTrip(id: string): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.db.collection('Trips').doc(id).delete().then(
        () => {
          location.reload();
        });
    }
  }

  filterTrips(filter: any): void {
    // this.trips = this.trips.filter((trip) => {
    //   const price = trip.Price >= filter.priceFrom
    //     && trip.Price <= filter.priceTo;
    //
    //   const date = new Date(trip.StartDate) >= filter.dateFrom
    //     && new Date(trip.EndDate) <= filter.dateTo;
    //
    //   const rating = !filter.rating
    //     || filter.rating.length === 0
    //     || filter.rating.includes(trip.Rating);
    //
    //   const location = !filter.location
    //     || filter.location.length === 0
    //     || filter.location.includes(trip.Country);
    //
    //   console.log(filter)
    //   return price && date && rating && location;
    // })
  }

  protected readonly document = document;
}


