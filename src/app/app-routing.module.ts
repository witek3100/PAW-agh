import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component'
import { TripsComponent } from "./trips/trips.component";
import { AddTripComponent } from "./add-trip/add-trip.component";
import { CartComponent } from "./cart/cart.component";
import { HistoryComponent } from "./history/history.component";
import { TripDetailsComponent } from "./trip-details/trip-details.component";
import {AdminGuard, AdminOrManagerGuard, ManagerGuard, UserGuard} from "./guard/auth.guard";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AdminPanelComponent } from "./admin-panel/admin-panel.component";
import { UpdateTripComponent } from "./update-trip/update-trip.component";
import {UserManagmentComponent} from "./user-managment/user-managment.component";

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'trips', component: TripsComponent },
  { path: 'add-trip', component: AddTripComponent, canActivate: [AdminOrManagerGuard]},
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [AdminOrManagerGuard] },
  { path: 'cart', component: CartComponent, canActivate: [UserGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [UserGuard] },
  { path: 'trip-details/:id', component: TripDetailsComponent, canActivate: [UserGuard] },
  { path: 'update-trip/:id', component: UpdateTripComponent, canActivate: [AdminOrManagerGuard]},
  { path: 'user-managment', component: UserManagmentComponent, canActivate: [AdminGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
