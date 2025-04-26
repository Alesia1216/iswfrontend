import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';
import { SessionService } from '../../../../service/session.service';

@Component({
    selector: 'app-usuario.clint.view.routed',
    templateUrl: './usuario.client.view.routed.component.html',
    styleUrls: ['./usuario.client.view.routed.component.css'],
    standalone: true,
    imports: [RouterModule]
})
export class UsuarioClientViewRoutedComponent implements OnInit {

  id: number = 0;
  oUsuario: IUsuario = {} as IUsuario;

  strRuta: string = '';

  constructor(
    private oRouter: Router,
    private oSessionService: SessionService,
    private oActivatedRoute: ActivatedRoute, 
    private oUsuarioService: UsuarioService
  ) { }

  ngOnInit() {

    this.id = this.oActivatedRoute.snapshot.params['id'];

    this.getOne();

    this.oRouter.events.subscribe((oEvent) => {
      if (oEvent instanceof NavigationEnd) {
        this.strRuta = oEvent.url;
      }
    });
  }

  getOne() {
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
    });
  }

  logout() {
    this.oRouter.navigate(['/logout']);
  }

  changePassword() {
    this.oRouter.navigate(['/logout']);
  }
}
