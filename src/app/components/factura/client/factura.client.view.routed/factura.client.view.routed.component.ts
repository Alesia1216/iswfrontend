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

declare let bootstrap: any;

@Component({
  selector: 'app-factura.client.view.routed',
  templateUrl: './factura.client.view.routed.component.html',
  styleUrls: ['./factura.client.view.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe],
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
 
   ngOnInit() {
    //  this.getPage();
    //  this.getAll();
   }
 
  //  getPage() {
  //    this.oCarritoService
  //      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
  //      .subscribe({
  //        next: (oPageFromServer: IPage<ICarrito>) => {
  //          //if(oPageFromServer.content[x].usuario.id == this.oUsuario.id){}       
  //          //this.oPage = oPageFromServer;
  //          this.oPage = oPageFromServer;
  //          this.arrBotonera = this.oBotoneraService.getBotonera(
  //            this.nPage,
  //            oPageFromServer.totalPages
  //          );
 
  //          console.log(this.oPage);
  //        },
  //        error: (err: HttpErrorResponse) => {
  //          console.log(err);
  //        },
  //      });
  //  }
 
  //  getAll(){
  //    this.oCarritoService
  //    .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
  //    .subscribe({
  //      next: (oPageFromServer: IPage<ICarrito>) => {
  //        this.allCarritoLines = [...this.allCarritoLines, ...oPageFromServer.content]; // Acumulamos los datos
 
  //        if (this.nPage < oPageFromServer.totalPages - 1) {
  //          this.nPage++; // Pasamos a la siguiente página
  //          this.getAll(); // Llamamos recursivamente hasta la última página
  //        } 
  //      },
  //      error: (err: HttpErrorResponse) => {
  //        console.log('Error al obtener las compras:', err);
  //      },
  //    });
  //  }
 
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
     if (!this.oPage || !this.oPage.content) {
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
     doc.text('Informe de mi pedido', pageWidth / 2, 40, { align: 'center' });
     
     doc.setFontSize(14);
     y = 60;
     
     this.oPage.content.forEach((lineafactura, index) => {
       if (y + 40 > maxY) {
         doc.addPage();
         doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
         y = marginY;
       }
     
       doc.setTextColor(50, 50, 50);
       doc.setFontSize(14);
       let textoCompra = `Producto ${lineafactura.producto.descripcion}`;
       doc.text(textoCompra, pageWidth / 2, y, { align: 'center' });
     
       y += 10;
       let infoUsuario = `Email: ${lineafactura.factura.usuario.email} - Dirección:${lineafactura.factura.usuario.direccion}`;
       doc.setFontSize(12);
       doc.text(infoUsuario, pageWidth / 2, y, { align: 'center' });
     
       y += 10;
       let infoProducto = `Estilo: ${lineafactura.producto.estilo} - Precio: ${lineafactura.precio}€`;
       doc.text(infoProducto, pageWidth / 2, y, { align: 'center' });
     
       y += 10;
       let fechaCompra = `Fecha de compra: ${this.formatDate(lineafactura.factura.fecha.toString())}`;
       doc.text(fechaCompra, pageWidth / 2, y, { align: 'center' });
     
       y += 15;
       doc.setDrawColor(150, 150, 150);
       doc.line(marginX, y, pageWidth - marginX, y);
     
       y += 10;
     });
   
     doc.save('InformeHistorialPedidos.pdf');
   }
 
 }
 
 
