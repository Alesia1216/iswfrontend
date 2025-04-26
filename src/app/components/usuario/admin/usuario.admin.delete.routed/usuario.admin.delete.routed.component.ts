import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { SessionService } from '../../../../service/session.service';


declare let bootstrap: any;

@Component({
    selector: 'app-usuario.admin.delete.routed',
    templateUrl: './usuario.admin.delete.routed.component.html',
    styleUrls: ['./usuario.admin.delete.routed.component.css'],
    standalone: true,
    imports:[ RouterModule, TrimPipe] ,
})
export class UsuarioAdminDeleteRoutedComponent implements OnInit {

  oUsuario: IUsuario | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oUsuarioService: UsuarioService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router,
    private oSessionService: SessionService
  ) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oUsuarioService.get(id).subscribe({
      next: (oUsuario: IUsuario) => {
        this.oUsuario = oUsuario;
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al cargar el usuario');
      },
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  delete(): void {
    if (!this.oUsuario) return;
    this.oUsuarioService.delete(this.oUsuario.id).subscribe({
      next: () => {
        this.showModal('Usuario ' + this.oUsuario!.nombre + ' ha sido borrado');
        if (this.oSessionService.getSessionEmail() === this.oUsuario!.email) {
          this.oSessionService.logout();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al borrar el usuario');
      },
    });
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/usuario/admin/plist']);
  }

}

