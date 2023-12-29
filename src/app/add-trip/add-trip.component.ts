import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {
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

  public constructor(private db: AngularFirestore, private fb: FormBuilder, private router: Router) {}

  public ngOnInit(): void {
    const url: string = '/assets/trips.json';

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
  }

  onSubmit(): void {
    if (this.AddTripForm.valid) {
      const formData = { ...this.AddTripForm.value };
      this.db.collection('Trips').add({ ...formData }).then(() => {
        this.router.navigate(['/trips']);
      });
    }
  }
}
