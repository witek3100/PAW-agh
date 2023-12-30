import {Component, OnInit} from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import {CartItem} from "../cart-item.model";
import {Trip} from "../trip.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartItems: any[] = [];

  public constructor(private db: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.db.collection('CartItems').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        const cartItem = doc.data() as CartItem;

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

  }

}
