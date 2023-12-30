import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";

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
  @Output() filterChange: EventEmitter<any> = new EventEmitter();
  @Input() availableCountries: string[] = [];
  filterForm: FormGroup;
  maxPrice: number;

  constructor(private fb: FormBuilder, private db: AngularFirestore,) {}


  ngOnInit(): void {

    this.maxPrice = 0

    this.db.collection('Trips').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const data = doc.data() as {};
        this.availableCountries.push(data['Country' as keyof typeof data]);

        var price = data['Price' as keyof typeof data]
        if (price > this.maxPrice) {
          this.maxPrice = price
        }
      })
    })

    this.filterForm = this.fb.group({
      country: [''],
      startDate: [''],
      endDate: [''],
      priceMin: [0],
      priceMax: [0]
    });
  }

  applyFilter() {
    this.filterChange.emit(this.filterForm.value);
  }
}
