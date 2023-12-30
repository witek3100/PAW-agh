import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CartItem} from "../cart-item.model";
import {Order} from "../order.model";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  orders: any[] = [];

  public constructor(private db: AngularFirestore) {}

  ngOnInit(): void {
    this.db.collection('OrdersHistory').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        var orderID = doc.id;
        var order = doc.data() as Order;
        var trips: string[] =  []

        this.db.collection('CartItems').get().subscribe((ss2) => {
          ss2.docs.forEach((doc2) => {
            var cartitem = doc2.data() as CartItem;
            if (order.CartItems.includes(doc2.id)) {
              trips.push(cartitem.TripID)
            }
          })
        })

        this.orders.push({
          'ID': orderID,
          'Trips': trips,
          'Date': new Date(order.Date)
        })

      })
    })

  }
}
