import { HttpClient } from "@angular/common/http";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})

export class TripsComponent implements OnInit {
  public tripsInfo: any;
  public constructor(private http: HttpClient) {}
  public ngOnInit(): void {
    const url: string = '/assets/trips.json';
    this.http.get(url).subscribe((response) => {
      this.tripsInfo = response
    })
  }
}
