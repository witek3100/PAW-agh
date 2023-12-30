import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { TripsComponent } from "./trips/trips.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FilterTripsComponent } from "./filter-trips/filter-trips.component";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { CartComponent } from './cart/cart.component';
import { HistoryComponent } from './history/history.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire/compat";
import { TripDetailsComponent } from './trip-details/trip-details.component';


@NgModule({
  declarations: [
    AppComponent, TripsComponent, LandingPageComponent, AddTripComponent, CartComponent, HistoryComponent, TripDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FilterTripsComponent,
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
