import { Component, OnInit } from '@angular/core';
import { jsPDF } from "jspdf";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, Subject } from 'rxjs';

import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { IPage } from '../../../../model/model.interface';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { BotoneraService } from '../../../../service/botonera.service';

@Component({
    selector: 'app-producto.admin.plist.routed',
    templateUrl: './producto.admin.plist.routed.component.html',
    styleUrls: ['./producto.admin.plist.routed.component.css'],
    imports: [CommonModule, FormsModule, TrimPipe, RouterModule]
})

export class ProductoAdminPlistRoutedComponent implements OnInit {

  oPage: IPage<IProducto> | null = null;
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

    private oProductoService: ProductoService,
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
    this.oProductoService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<IProducto>) => {
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

   edit(oProducto: IProducto) {
     this.oRouter.navigate(['/producto/admin/edit', oProducto.id]);
   }

   view(oProducto: IProducto) {
     this.oRouter.navigate(['/producto/admin/view', oProducto.id]);
   }

   remove(oProducto: IProducto) {
     this.oRouter.navigate(['/producto/admin/delete', oProducto.id]);
   }

   goToCreate(){
     this.oRouter.navigate(['/producto/admin/create']);
   }

   goBack(){
     this.oRouter.navigate(['/producto/client/plist']);
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
  doc.text('Informe de Productos', pageWidth / 2, 40, { align: 'center' });

  y = 60;

  this.oPage.content.forEach((producto, index) => {
    if (y + 30 > maxY) {
      doc.addPage();
      doc.addImage(fondoImg, 'PNG', 0, 0, imgWidth, imgHeight);
      y = marginY;
    }

    const descripcion = producto.descripcion ?? 'Producto sin descripción';
    const precio = producto.precio?.toFixed(2) ?? '0.00';
    const unidades = producto.unidades ?? 0;

    doc.setFontSize(14);
    doc.setTextColor(50, 50, 50);
    doc.text(`Producto: ${descripcion}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(`Precio: ${precio}€`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    if (unidades === 1) {
      doc.setTextColor(255, 0, 0); // rojo
      doc.text(`Queda 1 unidad`, pageWidth / 2, y, { align: 'center' });
    } else {
      doc.setTextColor(100, 100, 100);
      doc.text(`Quedan ${unidades} unidades`, pageWidth / 2, y, { align: 'center' });
    }

    y += 15;
    doc.setDrawColor(150, 150, 150);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 10;
  });

  doc.save('InformeProductos.pdf');
}

}
