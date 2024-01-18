import {Timestamp} from "@firebase/firestore-types";

export interface Order {
  CartItems: string[],
  Date: Timestamp,
  UserID: string
}
