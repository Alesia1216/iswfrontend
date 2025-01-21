import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';

@Component({
  standalone: true,
  selector: 'app-navbar-unrouted',
  templateUrl: './navbar.unrouted.component.html',
  styleUrls: ['./navbar.unrouted.component.css']
})
export class NavbarUnroutedComponent implements OnInit {

  strRuta: string = '';

  activeSession: boolean = false;

  oUsuario: IUsuario = {} as IUsuario;
  email: string = '';

  constructor(
    private oRouter: Router,
    private oSessionService: SessionService,
    private oUsuarioService: UsuarioService
  ) {
    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });
    this.activeSession = this.oSessionService.isSessionActive();
    if(this.activeSession){
      this.email = this.oSessionService.getSessionEmail();
      this.getUsuarioSession();
    }
   }

  ngOnInit() {
    this.oSessionService.onLogin().subscribe({
      next: () => {
        // ya hay session
        this.activeSession = true;
        this.email = this.oSessionService.getSessionEmail();
        this.getUsuarioSession();
      }
    })
    this.oSessionService.onLogout().subscribe({
      next: () => {
        // ya hay session
        this.activeSession = false;
      }
    })
  }

  getUsuarioSession(){
    this.oUsuarioService.getbyEmail(this.email).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
