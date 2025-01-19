import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';

@Component({
  selector: 'app-producto.admin.view.routed',
  templateUrl: './producto.admin.view.routed.component.html',
  styleUrls: ['./producto.admin.view.routed.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class ProductoAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oProducto: IProducto = {} as IProducto;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;

  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oProductoService: ProductoService
  ) { }

  ngOnInit() {

    this.id = this.oActivatedRoute.snapshot.params['id'];

    this.getOne();
  }

  getOne() {
    this.oProductoService.get(this.id).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
    });
  }
}
