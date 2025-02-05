import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { TipousuarioService } from '../../../service/tipousuario.service';



declare let bootstrap: any;

@Component({
    selector: 'app-tipousuario.admin.delete.routed',
    templateUrl: './tipousuario.admin.delete.routed.component.html',
    styleUrls: ['./tipousuario.admin.delete.routed.component.css'],
    standalone: true,
    imports:[ RouterModule] ,
})
export class TipousuarioAdminDeleteRoutedComponent implements OnInit {

  oTipousuario: ITipousuario | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oTipousuarioService: TipousuarioService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oTipousuarioService.get(id).subscribe({
      next: (oTipousuario: ITipousuario) => {
        this.oTipousuario = oTipousuario;
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al cargar el tipo de usuario');
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
    this.oTipousuarioService.delete(this.oTipousuario!.id).subscribe({
      next: (data) => {
        this.showModal(
          'Tipo de usuario ' + this.oTipousuario!.descripcion + ' ha sido borrado'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al borrar el tipo de usuario');
      },
    });
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/tipousuario/admin/plist']);
  }

}

