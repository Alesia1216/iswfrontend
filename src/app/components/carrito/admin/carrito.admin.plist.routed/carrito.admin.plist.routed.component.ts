import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { ICarrito } from '../../../../model/carrito.interface';
import { IPage } from '../../../../model/model.interface';
import { Subject } from 'rxjs';
import { CarritoService } from '../../../../service/carrito.service';
import { BotoneraService } from '../../../../service/botonera.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';

declare let bootstrap: any;

@Component({
  selector: 'app-carrito.admin.plist.routed',
  templateUrl: './carrito.admin.plist.routed.component.html',
  styleUrls: ['./carrito.admin.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe],
  providers: [DatePipe],
  standalone: true
})
export class CarritoAdminPlistRoutedComponent implements OnInit {

 oPage: IPage<ICarrito> = {} as IPage<ICarrito>;
 email: string = '';
 activeSession: boolean = false;

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
  allCarritoLines: ICarrito[] = [];

  private debounceSubject = new Subject<string>();

  constructor(

    private oCarritoService: CarritoService,
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

  }

  ngOnInit() {
    this.getPage();
    this.getAll();
  }

  getPage() {
    this.oCarritoService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<ICarrito>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );

          console.log(this.oPage);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getAll(){
    this.oCarritoService
    .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
    .subscribe({
      next: (oPageFromServer: IPage<ICarrito>) => {
        this.allCarritoLines = [...this.allCarritoLines, ...oPageFromServer.content]; // Acumulamos los datos

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

  view(oCarrito: ICarrito) {
    this.oRouter.navigate(['/carrito/admin/view/', oCarrito.id]);
  }

  goBack(){
    this.oRouter.navigate(['/carrito/client/plist']);
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

  showModal(mensaje: string, callback: () => void) {
    this.strMessage = mensaje;
    this.onYesCallback = callback;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
  }

  onYes() {
    if (this.onYesCallback) {
      this.onYesCallback(); // Ejecuta la acción que corresponda
    }
    this.hideModal();
  }

  delete(oCarrito: ICarrito){
    this.oCarritoService.delete(oCarrito.id).subscribe(() => {
      this.getPage();
    });
  }

}

