import { Component, OnInit } from '@angular/core';
import { ICompra } from '../../../model/compra.interface';
import { IPage } from '../../../model/model.interface';
import { debounceTime, Subject } from 'rxjs';
import { CompraService } from '../../../service/compra.service';
import { BotoneraService } from '../../../service/botonera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-compra.client.historial.routed',
  templateUrl: './compra.client.historial.routed.component.html',
  styleUrls: ['./compra.client.historial.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe]
})

export class CompraClientHistorialRoutedComponent implements OnInit {

  oPage: IPage<ICompra> | null = null;
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
  id_usuario: number = 0;
  //
  private debounceSubject = new Subject<string>();

  constructor(

    private oCompraService: CompraService,
    private oBotoneraService: BotoneraService,
    private oActivatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) { 
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    this.oActivatedRoute.params.subscribe((params) => {
      this.id_usuario = params['id'];
    });

  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oCompraService
      .getHistorial(this.id_usuario,this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<ICompra>) => {
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Horas en UTC
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  //  edit(oCompra: ICompra) {
  //    this.oRouter.navigate(['/compra/admin/edit', oCompra.id]);
  //  }

   //view(oCompra: ICompra) {
     //this.oRouter.navigate(['/Compra/admin/view', oCompra.id]);
   //}

  //  remove(oCompra: ICompra) {
  //    this.oRouter.navigate(['/Compra/admin/delete', oCompra.id]);
  //  }

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
  
    this.oPage.content.forEach((Compra, index) => {
      let x = 30; // Posición inicial en X para cada fila
  
      // Nombre del Compra en negrita
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(Compra.fecha.toString(), x, y);
  
      // Precio del Compra
      x += 70; // Espacio para el precio
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(`${Compra.producto.descripcion}`, x, y);
  
      // Precio del Compra
      x += 30; // Espacio para el precio
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(`${Compra.producto.estilo}`, x, y);

      x += 30; // Espacio para el precio
      doc.setFontSize(14);
      doc.setTextColor(50, 50, 50);
      doc.text(`${Compra.producto.precio}€`, x, y);
  
      y += 10; // Espacio entre filas
    });
  
    doc.save('InformeHistorialPedidos.pdf');
  }

}
