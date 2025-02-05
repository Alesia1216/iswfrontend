import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { TipousuarioService } from '../../../service/tipousuario.service';


@Component({
    selector: 'app-tipousuario.admin.view.routed',
    templateUrl: './tipousuario.admin.view.routed.component.html',
    styleUrls: ['./tipousuario.admin.view.routed.component.css'],
    standalone: true,
    imports: [RouterModule]
})
export class TipousuarioAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oTipousuario: ITipousuario = {} as ITipousuario;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;

  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oTipousuarioService: TipousuarioService
  ) { }

  ngOnInit() {

    this.id = this.oActivatedRoute.snapshot.params['id'];

    this.getOne();
  }

  getOne() {
    this.oTipousuarioService.get(this.id).subscribe({
      next: (data: ITipousuario) => {
        this.oTipousuario = data;
      },
    });
  }
}
