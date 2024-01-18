import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from '@angular/router';
import {TripService} from "../trip.service";
import {Trip} from "../trip.model";

@Component({
  selector: 'update-trip',
  templateUrl: './update-trip.component.html',
  styleUrls: ['./update-trip.component.css']
})
export class UpdateTripComponent implements OnInit {
  public UpdateTripForm: FormGroup;
  id: string;
  trip: Trip;

  formErrors = {
    Name: '',
    Country: '',
    startDate: '',
    endDate: '',
    Price: '',
    PlacesTotal: '',
    PlacesReserved: '',
    Description: '',
    Map: ''
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

  public constructor(private db: AngularFirestore, private fb: FormBuilder, private route: ActivatedRoute, private tripService: TripService) {}

  public ngOnInit(): void {

    this.UpdateTripForm = this.fb.group({
      Name: new FormControl(this.trip.Name, Validators.minLength(5)),
      Country: new FormControl(this.trip.Country, Validators.required),
      StartDate: new FormControl(this.trip.StartDate, Validators.required),
      EndDate: new FormControl(this.trip.EndDate, Validators.required),
      Price: new FormControl(this.trip.Price, [Validators.required, Validators.min(0)]),
      PlacesTotal: new FormControl(this.trip.PlacesTotal, [Validators.required, Validators.min(1)]),
      PlacesReserved: new FormControl(this.trip.PlacesReserved, Validators.min(0)),
      Description: new FormControl(this.trip.Description, [Validators.required, Validators.minLength(30), Validators.maxLength(300)]),
      Map: new FormControl(this.trip.Map)
    })

    this.route.params.subscribe(params => {
      this.id = params['id'];
    })

    this.db.collection('Trips').doc(this.id).get().subscribe(ss => {
      this.trip = ss.data() as Trip;
    })

    this.UpdateTripForm.valueChanges.subscribe((value) => {
      this.onControlValueChanged();
    });

    this.onControlValueChanged();
  }

  onControlValueChanged() {
    const form = this.UpdateTripForm;

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
  }

  onSubmit(): void {
    if (this.UpdateTripForm.valid) {
      const formData = { ...this.UpdateTripForm.value };
      console.log(formData)
    }
  }
}

