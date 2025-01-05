import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar-unrouted',
  templateUrl: './navbar.unrouted.component.html',
  styleUrls: ['./navbar.unrouted.component.css']
})
export class NavbarUnroutedComponent implements OnInit {

  strRuta: string = '';

  constructor(private oRouter: Router) {

    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });

   }

  ngOnInit() {
  }

}
