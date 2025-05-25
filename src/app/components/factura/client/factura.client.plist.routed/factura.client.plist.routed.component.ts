import { Component, OnInit } from '@angular/core';
import { IPage } from '../../../../model/model.interface';
import { debounceTime, Observable, Subject } from 'rxjs';
import { CompraService } from '../../../../service/compra.service';
import { BotoneraService } from '../../../../service/botonera.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Action } from 'rxjs/internal/scheduler/Action';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { DatePipe } from '@angular/common';
import { FacturaService } from '../../../../service/factura.service';
import { LineafacturaService } from '../../../../service/lineafactura.service';
import { IFactura } from '../../../../model/factura.interface';
import { ILineafactura } from '../../../../model/lineafactura.interface';

@Component({
  selector: 'app-factura.client.plist.routed',
  templateUrl: './factura.client.plist.routed.component.html',
  styleUrls: ['./factura.client.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe]
})
export class FacturaClientPlistRoutedComponent implements OnInit {

  oPage: IPage<IFactura> | null = null;
  totalesFactura: Map<number, number> = new Map();
  oLineasFactura: ILineafactura[] = [];
  //  //
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
 
     //private oCompraService: CompraService,
     private oFacturaService: FacturaService,
     private oLineafacturaService: LineafacturaService,
     private oBotoneraService: BotoneraService,
     private oActivatedRoute: ActivatedRoute,
     private oRouter: Router
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
     this.oFacturaService
       .getHistorial(this.id_usuario,this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
       .subscribe({
         next: (oPageFromServer: IPage<IFactura>) => {
           this.oPage = oPageFromServer;
           this.arrBotonera = this.oBotoneraService.getBotonera(
             this.nPage,
             oPageFromServer.totalPages
           );
            this.precargarTotales(); 
         },
         error: (err: HttpErrorResponse) => {
           console.log(err);
         },
       });
   }

precargarTotales() {
  if (!this.oPage) return;
  for (let factura of this.oPage.content) {
    this.oLineafacturaService.getByFacturaId(factura.id!).subscribe({
      next: (lineas) => {
       this.oLineasFactura = lineas;
        let total = 0;
        for (let linea of this.oLineasFactura) {
          total += linea.precio * linea.cantidad;
        }
        this.totalesFactura.set(factura.id!, total);
      },
      error: (err) => console.error(err),
    });
  }
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
 
 
    view(oFactura: IFactura) {
      this.oRouter.navigate(['/factura/client/view/', oFactura.id]);
    }
 
    delete(oCompra: IFactura) {
    //  this.oRouter.navigate(['/compra/cancel/', oCompra.id]);
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
 
 }
 
