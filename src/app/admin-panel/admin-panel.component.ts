import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip.service'; // Update the path accordingly
import { Trip } from '../trip.model';
import {NgForm} from "@angular/forms";
import {user} from "@angular/fire/auth";
import {UserService} from "../user.service"; // Update the path accordingly

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  trips: Trip[];

  constructor(private tripService: TripService, protected userService: UserService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.tripService.getTrips().subscribe((trips) => {
      this.trips = trips;
    });
  }

  deleteTrip(tripId: string | undefined): void {
    if (tripId){
        if (confirm('Are you sure you want to delete this trip?')) {
          this.tripService.deleteTrip(tripId).then(() => {
            this.loadTrips();
          });
      }
    }
  }

  protected readonly user = user;
}
