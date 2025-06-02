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
  if (!this.oPage || !this.oPage.content || this.oPage.content.length === 0) {
    console.error('No hay datos disponibles para generar el informe.');
    return;
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 25;
  const marginY = 50;
  const maxY = 260;

  const fondoImg = new Image();
  fondoImg.src = '../../../../../assets/fondo.png';

  const imgWidth = 210;
  const imgHeight = 297;
  let y = marginY;

  doc.addImage(fondoImg, 'PNG', 0, 0, imgWidth, imgHeight);
  doc.setFontSize(30);
  doc.setTextColor(40);
  doc.text('Informe de Usuarios', pageWidth / 2, 40, { align: 'center' });

  y = 60;

  this.oPage.content.forEach((usuario, index) => {
    if (y + 30 > maxY) {
      doc.addPage();
      doc.addImage(fondoImg, 'PNG', 0, 0, imgWidth, imgHeight);
      y = marginY;
    }

    const nombreCompleto = `${usuario.nombre ?? ''} ${usuario.apellido1 ?? ''} ${usuario.apellido2 ?? ''}`.trim();
    const email = usuario.email ?? 'Sin email';
    const telefono = usuario.telefono ?? 'Sin teléfono';
    const direccion = usuario.direccion ?? 'Sin dirección';

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Nombre: ${nombreCompleto}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(12);
    doc.text(`Email: ${email}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.text(`Teléfono: ${telefono}`, pageWidth / 2, y, { align: 'center' });

    if (direccion) {
      y += 10;
      doc.text(`Dirección: ${direccion}`, pageWidth / 2, y, { align: 'center' });
    }

    y += 15;
    doc.setDrawColor(150, 150, 150);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 10;
  });

  doc.save('InformeUsuarios.pdf');
}

}
