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
  //
  //id_usuario: number = 0;
  //
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

generarInforme() {
  if (!this.oPage || !this.oPage.content) {
    console.error('No hay datos disponibles para generar el informe.');
    return;
  }

  let doc = new jsPDF({ unit: 'mm', format: 'a4' });

  // Dimensiones de la página (A4: 210 x 297 mm)
  const pageWidth = 210;
  const pageHeight = 297;

  // Ajustes de márgenes internos basados en la imagen proporcionada
  const marginX = 25;  // Márgenes laterales para no sobrepasar el borde decorativo
  const marginY = 50;  // Espacio superior inicial (ajustado para el título)
  const maxY = 260;    // Límite inferior antes de cambiar de página

  // Cargar la imagen de fondo
  let img = new Image();
  img.src = '../../../../../assets/fondo.png'; // Ruta correcta de la imagen
  let imgWidth = 210;  // Ancho total de la página
  let imgHeight = 297; // Alto total de la página

  let y = marginY;

  // Agregar la primera página con la imagen de fondo
  doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);

  // Encabezado centrado dentro del área blanca (movido a Y=40)
  doc.setFontSize(30);
  doc.setTextColor(40);
  doc.text('Informe de pedidos', pageWidth / 2, 40, { align: 'center' });

  doc.setFontSize(14);
  y = 60; // Ajuste para el contenido después del título

  this.oPage.content.forEach((Compra, index) => {
    // Verificar si hay espacio suficiente, si no, crear una nueva página
    if (y + 40 > maxY) {
      doc.addPage();
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
      y = marginY; // Reiniciar posición en nueva página
    }

    doc.setTextColor(50, 50, 50);

    // Primera línea: Producto comprado
    doc.setFontSize(14);
    let textoCompra = `Producto ${Compra.producto.descripcion} comprado por ${Compra.usuario.nombre}`;
    doc.text(textoCompra, pageWidth / 2, y, { align: 'center' });

    y += 10;

    // Segunda línea: Email y dirección
    let infoUsuario = `Email: ${Compra.usuario.email} - Dirección: ${Compra.usuario.direccion}`;
    doc.setFontSize(12);
    doc.text(infoUsuario, pageWidth / 2, y, { align: 'center' });

    y += 10;

    // Tercera línea: Estilo y precio del producto
    let infoProducto = `Estilo: ${Compra.producto.estilo} - Precio: ${Compra.producto.precio}€`;
    doc.text(infoProducto, pageWidth / 2, y, { align: 'center' });

    y += 10;

    // Cuarta línea: Fecha de compra
    let fechaCompra = `Fecha de compra: ${this.formatDate(Compra.fecha.toString())}`;
    doc.text(fechaCompra, pageWidth / 2, y, { align: 'center' });

    y += 15; // Espacio antes de la línea divisoria

    // Línea separadora
    doc.setDrawColor(150, 150, 150);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 10; // Espacio para la siguiente compra
  });

  doc.save('InformeHistorialPedidos.pdf');
}

  
  

}
