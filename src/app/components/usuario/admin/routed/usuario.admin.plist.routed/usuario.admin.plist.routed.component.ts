import { Component, OnInit } from '@angular/core';

import { IUsuario } from '../../../../../model/usuario.interface';
import { CommonModule } from '@angular/common';
import { IPage, Sort } from '../../../../../model/model.interface';
import { UsuarioService } from '../../../../../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../../../services/botonera.service';
import { OrdenarService } from '../../../../../services/ordenar.service';

@Component({
  selector: 'app-usuario.admin.plist.routed',
  templateUrl: './usuario.admin.plist.routed.component.html',
  styleUrls: ['./usuario.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UsuarioService],
})
export class UsuarioAdminPlistRoutedComponent implements OnInit {

  lUsuarios: IUsuario[] = [];
  page: number = 0; // 0-based server count
  totalPages: number = 0;
  size: number = 10;

  arrBotonera: string[] = [];

  constructor(private oUsuarioService: UsuarioService, 
              private oBotoneraService: BotoneraService, 
              private oOrdenarService: OrdenarService) {}

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oUsuarioService.getPage(this.page, this.size).subscribe({
      next: (arrUsuario: IPage<IUsuario>) => {
        this.lUsuarios = arrUsuario.content;
        console.log(arrUsuario);
        this.totalPages = arrUsuario.totalPages;
        
        this.arrBotonera = this.oBotoneraService.getBotonera(this.page, this.totalPages);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPagesize( pagesize: number) {
    this.size = pagesize;
    this.getPage();
  }


  editar(oUsuario: IUsuario) {
    console.log('Editar', oUsuario);
  }

  eliminar(oUsuario: IUsuario) {
    console.log('Borrar', oUsuario);
  }

  goToPage(p: number) {
    if (p) {
      this.page = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.page++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.page--;
    this.getPage();
    return false;
  }

 Sort(columna: string, manera: string) {
  this.oOrdenarService.ordenar(this.page, this.size,columna, manera).subscribe({
    next: (arrUsuario: IPage<IUsuario>) => {
      this.lUsuarios = arrUsuario.content;
    },
    error: (err) => {
      console.log(err);
    },
  });
  return false;
 }

}