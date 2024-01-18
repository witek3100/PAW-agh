import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CartItem} from "../cart-item.model";
import {Order} from "../order.model";
import {UserService} from "../user.service";
import {User} from "@angular/fire/auth";
import {Timestamp} from "@firebase/firestore-types";
import {or} from "@angular/fire/firestore";
import {Trip} from "../trip.model";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  orders: any[] = [];
  userID: string;

  public constructor(private db: AngularFirestore, protected userService: UserService) {
    this.userService.user$.subscribe((user: User | null) => {
      this.userID = user?.uid as string
    })
  }

  ngOnInit(): void {
    this.db.collection('OrdersHistory').get().subscribe((ss) => {
      ss.docs.forEach((doc) => {
        var orderID = doc.id;
        var order = doc.data() as Order;

        if (order.UserID === this.userID) {

          var trips: {}[] = []

          this.db.collection('CartItems').get().subscribe((ss2) => {
            ss2.docs.forEach((doc2) => {
              var cartitem = doc2.data() as CartItem;
              if (order.CartItems.includes(doc2.id)) {

                this.db.collection('Trips').doc(cartitem.TripID).get().subscribe(ss => {
                  var tripData = ss.data() as Trip

                    trips.push({
                      'id': cartitem.TripID,
                      'amount': cartitem.Amount,
                      'tripName': tripData.Name
                    })

                })
              }
            })
          })

          this.orders.push({
            'ID': orderID,
            'Trips': trips,
            'Date': this.convertFirestoreTimestampToDate(order.Date)
          })
        }

      })
    })

  }

  convertFirestoreTimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  }
}
