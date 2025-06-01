import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { ICarrito } from '../../../../model/carrito.interface';
import { IPage } from '../../../../model/model.interface';
import { debounceTime, Subject } from 'rxjs';
import { BotoneraService } from '../../../../service/botonera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { FacturaService } from '../../../../service/factura.service';
import { LineafacturaService } from '../../../../service/lineafactura.service';
import { IFactura } from '../../../../model/factura.interface';
import { ILineafactura } from '../../../../model/lineafactura.interface';
import { serverURL } from '../../../../environment/environment';
import jsPDF from 'jspdf';
import { ProductoService } from '../../../../service/producto.service';

declare let bootstrap: any;

@Component({
  selector: 'app-factura.client.view.routed',
  templateUrl: './factura.client.view.routed.component.html',
  styleUrls: ['./factura.client.view.routed.component.css'],
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  standalone: true
})
export class FacturaClientViewRoutedComponent implements OnInit {

  oPage: IPage<ILineafactura> = {} as IPage<ILineafactura>;
  email: string = '';
  activeSession: boolean = false;
  id: number = 0;
  oFactura: IFactura = {} as IFactura;
  oLineasFactura: ILineafactura[] = []; 
  serverURL : string = serverURL;

  strMessage: string = '';
  myModal: any;
  onYesCallback: () => void = () => {}; // Función que se ejecutará si dice "Sí"
  //
   nPage: number = 0; // 0-based server count
   nRpp: number = 10;
   strField: string = '';
   strDir: string = '';
   strFiltro: string = '';
   //
   arrBotonera: string[] = [];
  
   private debounceSubject = new Subject<string>();
 
   constructor(
 
     private oFacturaService: FacturaService,
     private oLineafacturaService: LineafacturaService,
     private oSessionService: SessionService,
     private oUsuarioService: UsuarioService,
     private oBotoneraService: BotoneraService,
     private oActivatedRoute: ActivatedRoute,
     private oRouter: Router
   ) { 
     this.activeSession = this.oSessionService.isSessionActive();
     if(this.activeSession){
       this.email = this.oSessionService.getSessionEmail();
     }

     this.oActivatedRoute.params.subscribe((params) => {
       this.id = params['id'];
     });

     this.oFacturaService.get(this.id).subscribe({
       next: (data: IFactura) => {
         this.oFactura = data;
         this.getLineasfromFactura();
       },
       error: (err: HttpErrorResponse) => {
         console.log(err);
       },
     })
 
   }
 
   ngOnInit() {}
 
   getLineasfromFactura(){
    this.oLineafacturaService.getByFacturaId(this.oFactura.id!).subscribe({
      next: (data: ILineafactura[]) => {
        this.oLineasFactura = data;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
    })
   }

   view(oCarrito: ICarrito) {
     this.oRouter.navigate(['/carrito/admin/view/', oCarrito.id]);
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
 
  generarInforme() {
  if (!this.oLineasFactura || this.oLineasFactura.length === 0) {
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

  let imgWidth = 210;
  let imgHeight = 297;
  let y = marginY;

  doc.addImage(fondoImg, 'PNG', 0, 0, imgWidth, imgHeight);
  doc.setFontSize(30);
  doc.setTextColor(40);
  doc.text('Informe de mi pedido', pageWidth / 2, 40, { align: 'center' });

  y = 60;

  this.oLineasFactura.forEach((linea, index) => {
    if (y + 40 > maxY) {
      doc.addPage();
      doc.addImage(fondoImg, 'PNG', 0, 0, imgWidth, imgHeight);
      y = marginY;
    }

    const producto = linea.producto;
    const factura = linea.factura;
    const usuario = factura?.usuario;

    const email = usuario?.email ?? 'N/A';
    const direccion = usuario?.direccion ?? 'N/A';
    const estilo = producto?.estilo ?? 'N/A';
    const descripcion = producto?.descripcion ?? 'Producto sin descripción';
    const precio = linea.precio?.toFixed(2) ?? '0.00';
    const fecha = this.formatDate(factura?.fecha?.toString() ?? '');

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.text(`Producto: ${descripcion}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.setFontSize(12);
    doc.text(`Email: ${email} - Dirección: ${direccion}`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.text(`Estilo: ${estilo} - Precio: ${precio}€`, pageWidth / 2, y, { align: 'center' });

    y += 10;
    doc.text(`Fecha de compra: ${fecha}`, pageWidth / 2, y, { align: 'center' });

    y += 15;
    doc.setDrawColor(150, 150, 150);
    doc.line(marginX, y, pageWidth - marginX, y);

    y += 10;
  });

  doc.save('InformeHistorialPedidos.pdf');
}
 
 }
 
 
