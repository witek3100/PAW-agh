import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip } from '../trip.model'
@Injectable({
  providedIn: 'root',
})
export class LoadTripsService {
  private citiesUrl = '/assets/trips.json';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.citiesUrl);
  }
}
