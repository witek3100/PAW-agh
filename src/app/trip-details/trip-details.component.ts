import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Trip} from "../trip.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Review} from "../review.model";

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {

  id: string;
  trip: Trip;
  public AddReviewForm: FormGroup;
  reviews: Review[] = [];

  formErrors = {
    Nick: '',
    Title: '',
    Content: '',
    Date: ''
  }

  private validationMessages = {
    Nick: {
      required: 'Nick is required'
    },
    Title: {
      required: 'Title is required'
    },
    Content: {
      required: 'Content is required'
    }
  }

  constructor(private fb: FormBuilder, private db: AngularFirestore, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })

    this.db.collection('Trips').doc(this.id).get().subscribe(ss => {
      this.trip = ss.data() as Trip;
    })

    this.AddReviewForm = this.fb.group({
      Nick: new FormControl('', Validators.required),
      Title: new FormControl('', Validators.required),
      Content: new FormControl('', Validators.required),
      Date: new FormControl('')
    })

    this.AddReviewForm.valueChanges.subscribe((value) => {
      this.onControlValueChanged();
    });

    this.onControlValueChanged();

    this.db.collection('Reviews').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const review = doc.data() as Review;
        if (review.TripID === this.id) {
          this.reviews.push(review)
        }
      })
    })

    console.log(this.reviews)
  }

  onControlValueChanged() {
    const form = this.AddReviewForm;

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

  onSubmit() {
    if (this.AddReviewForm.valid) {
      const formData = { ...this.AddReviewForm.value }
      Object.assign(formData, {'TripID': this.id})
      this.db.collection('Reviews').add({ ...formData }).then(() => {
        location.reload();
      })
    }
  }
}
