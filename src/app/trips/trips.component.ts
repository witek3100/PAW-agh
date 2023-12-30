import { Component, OnInit } from "@angular/core";
import { Trip } from '../trip.model'
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from '@angular/router';
import { FilterTripsComponent } from "../filter-trips/filter-trips.component";


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})

export class TripsComponent implements OnInit {
  public trips: any[] = [];
  public filteredTrips: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;

  filterForm: FormGroup;

  public constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router) {}
  public ngOnInit(): void {
    this.db.collection('Trips').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const trip = doc.data() as {};
        Object.assign(trip, {'id': doc.id})
        this.trips.push(trip)
      })
      this.filteredTrips = [...this.trips]
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

  protected readonly document = document;

  applyFilter(filter: any) {

    this.filteredTrips = [...this.trips]

    if (filter.country) {
      this.filteredTrips = this.filteredTrips.filter(trip => trip['Country'] === filter.country)
    }

    if (filter.startDate) {
      const startDateFilter = new Date(filter.startDate)
      this.filteredTrips = this.filteredTrips.filter(trip => new Date(trip['StartDate']) >= startDateFilter)
    }

    if (filter.endDate) {
      const endDateFilter = new Date(filter.endDate)
      this.filteredTrips = this.filteredTrips.filter(trip => new Date(trip['EndDate']) <= endDateFilter)
    }

    if (filter.priceMin) {
      this.filteredTrips = this.filteredTrips.filter(trip => trip['Price'] > filter.priceMin)
    }

    if (filter.priceMax) {
      this.filteredTrips = this.filteredTrips.filter(trip => trip['Price'] < filter.priceMax)
    }
  }

  get fTrips(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredTrips.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredTrips.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
}


