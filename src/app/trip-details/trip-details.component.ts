import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Trip} from "../trip.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Review} from "../review.model";
import { DomSanitizer } from '@angular/platform-browser';
import {CartItem} from "../cart-item.model";
import {Auth, User, user} from "@angular/fire/auth";
import {UserData} from "../user.model";
import {Subscription} from "rxjs";
import {UserService} from "../user.service";
import {Order} from "../order.model";
import { Location } from '@angular/common';
import { NgZone } from '@angular/core';


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
  userID: string;
  isVerified: boolean;
  isManager: boolean;
  hasOrdersWithTrip: boolean

  formErrors = {
    Title: '',
    Content: '',
    Date: ''
  }

  private validationMessages = {
    Title: {
      required: 'Title is required'
    },
    Content: {
      required: 'Content is required'
    }
  }

  constructor(
    private fb: FormBuilder,
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    protected userService: UserService,
    private location: Location,
  ) {
    this.userService.user$.subscribe((user: User | null) => {
      this.userID = user?.uid as string
    })
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })


    this.userService.user$.subscribe((user: User | null) => {
      this.userID = user?.uid as string;

      this.db.collection('Users').doc(this.userID).get().subscribe(ss => {
        var userData = ss.data() as UserData;
        this.isVerified = userData.IsVerified;
        this.isManager = userData.IsManager;

        this.db.collection('CartItems').get().subscribe(ss2 => {
          ss2.docs.forEach((doc2) => {
            var cartitem = doc2.data() as CartItem

            if (cartitem.UserID === this.userID && !cartitem.Active && cartitem.TripID === this.id) {
              this.hasOrdersWithTrip = true
            }
          })
        })

      });
    });

    this.db.collection('Trips').doc(this.id).get().subscribe(ss => {
      this.trip = ss.data() as Trip;
    })

    this.AddReviewForm = this.fb.group({
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
        window.location.reload()
      })
    }
  }

  addToCart(id: string): void {

    var exists = false;
    var new_amount: number = 0;
    var cartid: string = '';

    this.db.collection('CartItems').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const item = doc.data() as CartItem;
        if (item.TripID === id && item.Active && item.UserID === this.userID) {
          cartid = doc.id;
          exists = true
          new_amount = item.Amount + 1
        }
      })

      if (exists) {
        this.db.collection('CartItems').doc(cartid).update({
          'Amount': new_amount
        })
      } else {
        this.db.collection('CartItems').add({
          'TripID': id,
          'UserID': this.userID,
          'Amount': 1,
          'Active': true,
        })
      }

      this.router.navigate(['/cart'])
    })
  }

  goBack(): void {
    this.location.back();
  }


}

