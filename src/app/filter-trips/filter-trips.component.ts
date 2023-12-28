import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-filter-trips',
  templateUrl: './filter-trips.component.html',
  styleUrls: ['./filter-trips.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule
  ]
})

export class FilterTripsComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  filterForm: FormGroup;

  locations = ['Poland', 'France', 'Belgium']

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      location: [],
      priceFrom: [],
      priceTo: [],
      dateFrom: [],
      dateTo: [],
      rating: []
    })
    this.handleFilters();
  }

  handleFilters(): void {
    this.filterForm.valueChanges.pipe(
      startWith(this.filterForm.value),
      map((value) => this.mapFilter(value)),
      distinctUntilChanged(),
    ).subscribe((filtered) => {
      this.filterChanged.emit(filtered);
    });
  }

  mapFilter(filteredValues: any): any {
    return {
      location: filteredValues.location || [],
      priceFrom: filteredValues.priceFrom || 0,
      priceTo: filteredValues.priceTo || 1000,
      dateFrom: filteredValues.dateFrom || new Date(0),
      dateTo: filteredValues.dateTo || new Date(Number.MAX_SAFE_INTEGER),
      rating: filteredValues.rating || []
    }
  }

}
