import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { IPage } from '../../../model/model.interface';
import { TipousuarioService } from '../../../service/tipousuario.service';
import { BotoneraService } from '../../../service/botonera.service';


@Component({
    selector: 'app-tipousuario.admin.plist.routed',
    templateUrl: './tipousuario.admin.plist.routed.component.html',
    styleUrls: ['./tipousuario.admin.plist.routed.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
})
export class TipousuarioAdminPlistRoutedComponent implements OnInit {

 
  oPage: IPage<ITipousuario> | null = null;
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
  private debounceSubject = new Subject<string>();

  constructor(

    private oTipousuarioService: TipousuarioService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router
  ) { 
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });

  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oTipousuarioService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<ITipousuario>) => {
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

   edit(oTipousuario: ITipousuario) {
     this.oRouter.navigate(['/tipousuario/admin/edit', oTipousuario.id]);
   }

   view(oTipousuario: ITipousuario) {
     this.oRouter.navigate(['/usuario/admin/view', oTipousuario.id]);
   }

   remove(oTipousuario: ITipousuario) {
     this.oRouter.navigate(['/tipousuario/admin/delete', oTipousuario.id]);
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
  
    this.oPage.content.forEach((tipousuario, index) => {
      let x = 30; // Posición inicial en X para cada fila
  
      // Nombre del producto en negrita
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0);
      doc.text(tipousuario.id + ' : ' + tipousuario.descripcion + ' ' , x, y);
  
      y += 10; // Espacio entre filas
    });
  
    doc.save('InformeTiposDeUsuarios.pdf');
  }

}
