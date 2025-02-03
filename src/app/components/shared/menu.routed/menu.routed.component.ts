import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-routed',
  templateUrl: './menu.routed.component.html',
  styleUrls: ['./menu.routed.component.css'],
  standalone: true,
  imports: [RouterLink]
})
export class MenuRoutedComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
