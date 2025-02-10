import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ICompra } from '../../../../model/compra.interface';
import { IPage } from '../../../../model/model.interface';
import { debounceTime, Subject } from 'rxjs';
import { CompraService } from '../../../../service/compra.service';
import { BotoneraService } from '../../../../service/botonera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import { TrimPipe } from '../../../../pipe/trim.pipe';

@Component({
  selector: 'app-compra.admin.plist.routed',
  templateUrl: './compra.admin.plist.routed.component.html',
  styleUrls: ['./compra.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe],
  providers: [DatePipe]
})
export class CompraAdminPlistRoutedComponent implements OnInit {

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

  allCompras: ICompra[] = [];

  private debounceSubject = new Subject<string>();

  constructor(

    private oCompraService: CompraService,
    private oBotoneraService: BotoneraService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { 
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    this.oActivatedRoute.params.subscribe((params) => {
      //this.id_usuario = params['id'];
    });

  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oCompraService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
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

  getAll(){
    this.oCompraService
    .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
    .subscribe({
      next: (oPageFromServer: IPage<ICompra>) => {
        this.allCompras = [...this.allCompras, ...oPageFromServer.content]; // Acumulamos los datos

        if (this.nPage < oPageFromServer.totalPages - 1) {
          this.nPage++; // Pasamos a la siguiente página
          this.getAll(); // Llamamos recursivamente hasta la última página
        } 
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error al obtener las compras:', err);
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


   view(oCompra: ICompra) {
     this.oRouter.navigate(['/compra/admin/view/', oCompra.id]);
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

generarInforme( compras: ICompra[]) {
  
  this.getAll();

  if (!compras || compras.length === 0) {
    console.error('No hay datos disponibles para generar el informe.');
    return;
  }

  let doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 25;
  const marginY = 50;
  const maxY = 260;

  let img = new Image();
  img.src = '../../../../../assets/fondo.png';
  let imgWidth = 210;
  let imgHeight = 297;
  let y = marginY;

  doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
  doc.setFontSize(30);
  doc.setTextColor(40);
  doc.text('Informe de pedidos', pageWidth / 2, 40, { align: 'center' });

  doc.setFontSize(14);
  y = 60;

  compras.forEach((compra, index) => {
    if (y + 40 > maxY) {
      doc.addPage();
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
      y = marginY;
    }

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    let textoCompra = `Producto ${compra.producto.descripcion} comprado por ${compra.usuario.nombre}`;
    doc.text(textoCompra, pageWidth / 2, y, { align: 'center' });

    y += 10;
    let infoUsuario = `Email: ${compra.usuario.email} - Dirección: ${compra.usuario.direccion}`;
    doc.setFontSize(12);
    doc.text(infoUsuario, pageWidth / 2, y, { align: 'center' });

    y += 10;
    let infoProducto = `Estilo: ${compra.producto.estilo} - Precio: ${compra.producto.precio}€`;
    doc.text(infoProducto, pageWidth / 2, y, { align: 'center' });

    y += 10;
    let fechaCompra = `Fecha de compra: ${this.formatDate(compra.fecha.toString())}`;
    doc.text(fechaCompra, pageWidth / 2, y, { align: 'center' });

    y += 15;
    doc.setDrawColor(150, 150, 150);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 10;
  });

  doc.save('InformeHistorialPedidos.pdf');
}

}
