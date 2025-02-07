import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout.routed',
  templateUrl: './logout.routed.component.html',
  styleUrls: ['./logout.routed.component.css'],
  standalone: true
})
export class LogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionService,
    private oRouter: Router
  ) { }

  ngOnInit() {
  }

  logout(){
    this.oSessionService.logout();
    this.oRouter.navigate(['/shared/menu']);
  }

  goMenu(){
    this.oRouter.navigate(['/shared/menu']);
  }

}
