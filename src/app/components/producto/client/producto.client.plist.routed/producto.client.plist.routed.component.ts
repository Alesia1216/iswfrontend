import { Component, OnInit } from '@angular/core';

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
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { IUsuario } from '../../../../model/usuario.interface';


@Component({
    selector: 'app-producto.client.plist.routed',
    templateUrl: './producto.client.plist.routed.component.html',
    styleUrls: ['./producto.client.plist.routed.component.css'],
    imports: [CommonModule, FormsModule, TrimPipe, RouterModule]
})
export class ProductoClientPlistRoutedComponent implements OnInit {

  oPage: IPage<IProducto> | null = null;
  oUsuario : IUsuario | null = null
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
    private oSessionService: SessionService,
    private oUsuarioService : UsuarioService,
    private oRouter: Router
  ) { 
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });

  }

  ngOnInit() {
    this.getPage();
    this.getLoggedUser();
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

  //hacer una funcion que llame al session service, y si la sesion esta activa, devolver true
  //si esta activa conseguir el email
  //con el email hacer una llamada al servidor para que me devuelva el usuario

  getLoggedUser() {
    if( this.oSessionService.isSessionActive() ){
      let email: string = this.oSessionService.getSessionEmail();
      this.oUsuarioService.getbyEmail(email).subscribe({
        next: (data: IUsuario) => {
          this.oUsuario = data;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      })
        
    }
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
