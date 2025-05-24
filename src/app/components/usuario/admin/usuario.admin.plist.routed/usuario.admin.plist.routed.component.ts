import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';
import { UsuarioService } from '../../../../service/usuario.service';
import { IPage } from '../../../../model/model.interface';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { BotoneraService } from '../../../../service/botonera.service';
import { IUsuario } from '../../../../model/usuario.interface';
import { SessionService } from '../../../../service/session.service';

@Component({
    selector: 'app-usuario.admin.plist.routed',
    templateUrl: './usuario.admin.plist.routed.component.html',
    styleUrls: ['./usuario.admin.plist.routed.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class UsuarioAdminPlistRoutedComponent implements OnInit {

  oPage: IPage<IUsuario> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = '';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  idUsuarioSession : number = 0
  //
  private debounceSubject = new Subject<string>();

  constructor(

    private oUsuarioService: UsuarioService,
    private oBotoneraService: BotoneraService,
    private oSessionService : SessionService,
    private oRouter: Router
  ) { 
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });

  }

  ngOnInit() {
    this.getPage();

    const email = this.oSessionService.getSessionEmail();
    this.oUsuarioService.getbyEmail(email).subscribe({
      next: (data: IUsuario) => {
        this.idUsuarioSession = data.id;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    })
  }

  getPage() {
    this.oUsuarioService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<IUsuario>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

   edit(oUsuario: IUsuario) {
     this.oRouter.navigate(['/usuario/admin/edit', oUsuario.id]);
   }

   view(oUsuario: IUsuario) {
     this.oRouter.navigate(['/usuario/admin/view', oUsuario.id]);
   }

   remove(oUsuario: IUsuario) {
     this.oRouter.navigate(['/usuario/admin/delete', oUsuario.id]);
   }

   goBack(){
    this.oRouter.navigate(['/usuario/client/view', this.idUsuarioSession]);
   }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
    console.log(this.strFiltro);
  }

  generarInforme() {
    if (!this.oPage || !this.oPage.content) {
      console.error('No hay datos disponibles para generar el informe.');
      return;
    }
  
    let doc = new jsPDF();
  
    // Encabezado del documento
    doc.setFontSize(30);
    doc.setTextColor(40);
    doc.text('Informe de Usuarios', 50, 20);
  
    doc.setFontSize(14);
  
    let y = 40; // Posición inicial en el eje Y
  
    this.oPage.content.forEach((usuario, index) => {
      let x = 30; // Posición inicial en X para cada fila
  
      // Nombre del producto en negrita
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0);
      doc.text(usuario.nombre + ' ' + usuario.apellido1 + ' ' + usuario.apellido2 , x, y);
  
      // Precio del producto
      x += 60; // Espacio para el precio
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`${usuario.email}€`, x, y);
  
      // Cantidad disponible
      x += 70; // Espacio para el stock
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(`${usuario.telefono}`, x, y);
  
      y += 10; // Espacio entre filas
    });
  
    doc.save('InformeUsuarios.pdf');
  }

}
