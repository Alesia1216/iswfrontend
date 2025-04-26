import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-routed',
  templateUrl: './home.routed.component.html',
  styleUrls: ['./home.routed.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class HomeRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
