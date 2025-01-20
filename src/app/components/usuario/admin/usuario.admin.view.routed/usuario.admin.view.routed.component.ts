import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';


@Component({
    selector: 'app-usuario.admin.view.routed',
    templateUrl: './usuario.admin.view.routed.component.html',
    styleUrls: ['./usuario.admin.view.routed.component.css'],
    standalone: true,
    imports: [RouterModule]
})
export class UsuarioAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oUsuario: IUsuario = {} as IUsuario;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;

  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oUsuarioService: UsuarioService
  ) { }

  ngOnInit() {

    this.id = this.oActivatedRoute.snapshot.params['id'];

    this.getOne();
  }

  getOne() {
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
    });
  }
}
