import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { TripsComponent } from "./trips/trips.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FilterTripsComponent } from "./filter-trips/filter-trips.component";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddTripComponent } from './add-trip/add-trip.component';
import { CartComponent } from './cart/cart.component';
import { HistoryComponent } from './history/history.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from "@angular/fire/compat";
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { SafePipe } from './safe.pipe';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { UpdateTripComponent } from './update-trip/update-trip.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';

@NgModule({
  declarations: [
    AppComponent,
    TripsComponent,
    LandingPageComponent,
    AddTripComponent,
    CartComponent,
    HistoryComponent,
    TripDetailsComponent,
    SafePipe,
    LoginComponent,
    SignupComponent,
    AdminPanelComponent,
    UpdateTripComponent,
    UserManagmentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FilterTripsComponent,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
