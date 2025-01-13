import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductoService } from '../../../service/producto.service';
import { IProducto } from '../../../model/producto.interface';

@Component({
  selector: 'app-producto.view.routed',
  templateUrl: './producto.view.routed.component.html',
  styleUrls: ['./producto.view.routed.component.css']
})
export class ProductoViewRoutedComponent implements OnInit {

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
