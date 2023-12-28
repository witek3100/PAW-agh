import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Trip } from '../trip.model'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { LoadTripsService } from './load_trips.service';
import { FilterTripsComponent } from '../filter-trips/filter-trips.component'
import {filter} from "rxjs";


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})

export class TripsComponent implements OnInit {
  public trips: Trip[] = [];
  public AddTripForm: FormGroup;

  formErrors = {
    Name: '',
    Country: '',
    startDate: '',
    endDate: '',
    Price: '',
    PlacesTotal: '',
    PlacesReserved: '',
    Description: ''
  }

  private validationMessages = {
    Name: {
      minlength: 'Trip name must be at least 5 characters long',
      required: 'Trip name cannot be empty',
    },
    Country: {
      required: 'Country cannot be empty'
    },
    StartDate: {
      required: 'Start date cannot be empyt'
    },
    EndDate: {
      required: 'End date cannot be empty'
    },
    Price: {
      required: 'Price cannot be empty',
      min: 'Price must be grater than 0'
    },
    PlacesTotal: {
      required: 'Total places cannot be empty',
      min: 'Total amount of places must be grater than 1'
    },
    PlacesReserved: {
      min: 'Amount of reserved places cannot be less than 0'
    },
    Description: {
      minlength: 'Description should contain between 30 and 300 characters',
      maxlength: 'Description should contain between 30 and 300 characters',
    }
  }

  public constructor(private loadTripsService: LoadTripsService, private fb: FormBuilder) {}
  public ngOnInit(): void {
    const url: string = '/assets/trips.json';

    this.loadTripsService.getTrips().subscribe((trips : Trip[]) => {
      this.trips = trips;
    })

    this.AddTripForm = this.fb.group({
      Name: new FormControl('', Validators.minLength(5)),
      Country: new FormControl('', Validators.required),
      StartDate: new FormControl('', Validators.required),
      EndDate: new FormControl('', Validators.required),
      Price: new FormControl('', [Validators.required, Validators.min(0)]),
      PlacesTotal: new FormControl('', [Validators.required, Validators.min(1)]),
      PlacesReserved: new FormControl('0', Validators.min(0)),
      Description: new FormControl('', [Validators.required, Validators.minLength(30), Validators.maxLength(300)]),
    })

    this.AddTripForm.valueChanges.subscribe((value) => {
      this.onControlValueChanged();
    });

    this.onControlValueChanged();
  }

  onControlValueChanged() {
    const form = this.AddTripForm;

    for (let field in this.formErrors) {
      (this.formErrors as any)[field] = '';
      let control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const validationMessages = (this.validationMessages as any)[field];
        for (const key in control.errors) {
          (this.formErrors as any)[field] += validationMessages[key] + ' ';
        }
      }
    }
    console.log(this.AddTripForm.errors)
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

  onSubmit(): void {
    if (this.AddTripForm.valid) {
      const formData = FormData = { ...this.AddTripForm.value };
      this.trips.push(formData);
      this.AddTripForm.reset();
    }
  }

  filterTrips(filteredTrips: any): void {
    this.trips = this.trips.filter((trip) => {
      const price = trip.Price >= filteredTrips.priceFrom
        && trip.Price <= filteredTrips.priceTo;

      const date = new Date(trip.StartDate) >= filteredTrips.dateFrom
        && new Date(trip.EndDate) <= filteredTrips.dateTo;

      const rating = filteredTrips.rating.length === 8
        || filteredTrips.rating.includes(trip.Rating);

      const location = filteredTrips.location.length === 0
        || filteredTrips.location.includes(trip.Country);

      return price && date && rating && location;
    })
  }
}


