import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-logout.routed',
  templateUrl: './logout.routed.component.html',
  styleUrls: ['./logout.routed.component.css'],
  standalone: true
})
export class LogoutRoutedComponent implements OnInit {

  constructor(
    private oSessionService: SessionService
  ) { }

  ngOnInit() {
  }

  logout(){
    this.oSessionService.logout();
    this.oSessionService.deleteToken();

  }

}
