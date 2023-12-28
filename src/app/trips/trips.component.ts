import { Component, OnInit } from "@angular/core";
import { Trip } from '../trip.model'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { LoadTripsService } from './load_trips.service';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})

export class TripsComponent implements OnInit {
  public trips: Trip[] = [];

  public constructor(private loadTripsService: LoadTripsService, private fb: FormBuilder) {}
  public ngOnInit(): void {
    const url: string = '/assets/trips.json';

    this.loadTripsService.getTrips().subscribe((trips: Trip[]) => {
      this.trips = trips;
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
  }

  deleteTrip(index: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.trips.splice(index, 1);
    }
  }

  filterTrips(filter: any): void {
    this.trips = this.trips.filter((trip) => {
      const price = trip.Price >= filter.priceFrom
        && trip.Price <= filter.priceTo;

      const date = new Date(trip.StartDate) >= filter.dateFrom
        && new Date(trip.EndDate) <= filter.dateTo;

      const rating = !filter.rating
        || filter.rating.length === 0
        || filter.rating.includes(trip.Rating);

      const location = !filter.location
        || filter.location.length === 0
        || filter.location.includes(trip.Country);

      console.log(filter)
      return price && date && rating && location;
    })
  }
}


