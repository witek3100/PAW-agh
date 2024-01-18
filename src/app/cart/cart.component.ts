import {Component, OnInit} from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {CartItem} from "../cart-item.model";
import {Trip} from "../trip.model";
import {Router} from "@angular/router";
import {flush} from "@angular/core/testing";
import {UserService} from "../user.service";
import {User} from "@angular/fire/auth";
import { Timestamp } from '@firebase/firestore-types';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartItems: any[] = [];
  public userID: string

  public constructor(private db: AngularFirestore, private router: Router, protected userService: UserService) {
    this.userService.user$.subscribe((user: User | null) => {
      this.userID = user?.uid as string
    })
  }



  ngOnInit(): void {
    this.db.collection('CartItems').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const cartItem = doc.data() as CartItem;

        if (cartItem.Active && cartItem.UserID === this.userID) {
          this.db.collection('Trips').get().subscribe((ss) => {
            ss.docs.forEach((doct) => {
              const trip = doct.data() as Trip;
              if (doct.id === cartItem.TripID) {
                const item = {
                  'TripID': doct.id,
                  'CartItemID': doc.id,
                  'Amount': cartItem.Amount,
                  'Name': trip.Name,
                  'Country': trip.Country,
                  'Price': trip.Price,
                  'StartDate': trip.StartDate
                }
                this.cartItems.push(item)
              }
            })
          })
        }

      })
    })

  }

  changeAmount(cartItemID: string, change: number) {
    const new_amount = Number(this.cartItems.find(obj => obj['CartItemID'] === cartItemID)['Amount']) + Number(change)
    if (new_amount === 0){
      this.db.collection('CartItems').doc(cartItemID).delete().then(() => {
        location.reload();
        }
      )
    } else {
      this.db.collection('CartItems').doc(cartItemID).update({'Amount': new_amount}).then(() => {
        location.reload();
        }
      )
    }
  }

  getTotalPrice(): number {
    var totalPrice = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      totalPrice += this.cartItems[i]['Price'] * this.cartItems[i]['Amount']
    }
    return totalPrice;
  }

  buy() {
    if (confirm('Are you sure you want buy cart contents?')) {
      var ids = this.cartItems.map((item) => item.CartItemID)
      this.db.collection('OrdersHistory').add({
        'CartItems': ids,
        'Date': new Date(),
        'UserID': this.userID
      })

      for (var i = 0; i < ids.length; i++) {
        this.db.collection('CartItems').doc(ids[i]).update({'Active': false}).then(() => {
          this.router.navigate(['/history'])
        })
      }
    }
  }

}
