import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { TripsComponent } from "./trips/trips.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FilterTripsComponent } from "./filter-trips/filter-trips.component";

@NgModule({
  declarations: [
    AppComponent, TripsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FilterTripsComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
