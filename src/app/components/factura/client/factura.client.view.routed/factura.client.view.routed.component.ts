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

  oPage: IPage<ICarrito> = {} as IPage<ICarrito>;
  email: string = '';
  activeSession: boolean = false;
  id: number = 0;
  oFactura: IFactura = {} as IFactura;
  oLineasFactura: ILineafactura[] = []; 
 
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
 
   // delete(oCarrito: ICarrito) {
   //   this.oRouter.navigate(['/carrito/client/delete/', oCarrito.id]);
   // }
 
  //  goToPage(p: number) {
  //    if (p) {
  //      this.nPage = p - 1;
  //      this.getPage();
  //    }
  //    return false;
  //  }
 
  //  goToNext() {
  //    this.nPage++;
  //    this.getPage();
  //    return false;
  //  }
 
  //  goToPrev() {
  //    this.nPage--;
  //    this.getPage();
  //    return false;
  //  }
 
  //  sort(field: string) {
  //    this.strField = field;
  //    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
  //    this.getPage();
  //  }
 
  //  goToRpp(nrpp: number) {
  //    this.nPage = 0;
  //    this.nRpp = nrpp;
  //    this.getPage();
  //    return false;
  //  }
 
  //  filter(event: KeyboardEvent) {
  //    this.debounceSubject.next(this.strFiltro);
  //    console.log(this.strFiltro);
  //  }
 
  //  showModal(mensaje: string, callback: () => void) {
  //    this.strMessage = mensaje;
  //    this.onYesCallback = callback;
  //    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
  //      keyboard: false,
  //    });
  //    this.myModal.show();
  //  }
 
  //  hideModal = () => {
  //    this.myModal.hide();
  //  }
 
  //  onYes() {
  //    if (this.onYesCallback) {
  //      this.onYesCallback(); // Ejecuta la acción que corresponda
  //    }
  //    this.hideModal();
  //  }
 
  //  delete(oCarrito: ICarrito){
  //    this.showModal('¿Deseas borrar el producto del carrito?', () => {
  //      this.oCarritoService.delete(oCarrito.id).subscribe(() => {
  //        this.getPage();
  //      });
  //    });
  //  }
 
 }
 
 
