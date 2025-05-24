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
    if (!this.oPage || !this.oPage.content) {
      console.error('No hay datos disponibles para generar el informe.');
      return;
    }
  
    let doc = new jsPDF();
  
    // Encabezado del documento
    doc.setFontSize(30);
    doc.setTextColor(40);
    doc.text('Informe de Productos', 50, 20);
  
    doc.setFontSize(14);
  
    let y = 40; // Posición inicial en el eje Y
  
    this.oPage.content.forEach((producto, index) => {
      let x = 30; // Posición inicial en X para cada fila
  
      // Nombre del producto en negrita
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(producto.descripcion, x, y);
  
      // Precio del producto
      x += 60; // Espacio para el precio
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(`${producto.precio}€`, x, y);
  
      // Cantidad disponible
      x += 40; // Espacio para el stock
      doc.setFontSize(12);
      if (producto.unidades === 1) {
        doc.setTextColor(255, 0, 0); // Rojo si queda solo 1 unidad
        doc.text(`Queda ${producto.unidades} unidad`, x, y);
      } else {
        doc.setTextColor(100, 100, 100);
        doc.text(`Quedan ${producto.unidades} unidades`, x, y);
      }
  
      y += 10; // Espacio entre filas
    });
  
    doc.save('InformeProductos.pdf');
  }

}
