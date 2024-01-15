import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component'
import { TripsComponent } from "./trips/trips.component";
import { AddTripComponent } from "./add-trip/add-trip.component";
import { CartComponent } from "./cart/cart.component";
import { HistoryComponent } from "./history/history.component";
import { TripDetailsComponent } from "./trip-details/trip-details.component";
import { AuthGuard } from "./guard/auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'add-new-trip', component: AddTripComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  { path: 'trip-details/:id', component: TripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
