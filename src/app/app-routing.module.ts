import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component'
import { TripsComponent} from "./trips/trips.component";
import {AddTripComponent} from "./add-trip/add-trip.component";
import {CartComponent} from "./cart/cart.component";
import {HistoryComponent} from "./history/history.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'add-new-trip', component: AddTripComponent },
  { path: 'cart', component: CartComponent },
  { path: 'history', component: HistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
