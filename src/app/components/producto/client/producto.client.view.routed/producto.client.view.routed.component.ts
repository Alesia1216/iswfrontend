import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { serverURL } from '../../../../environment/environment';

@Component({
  selector: 'app-producto.client.view.routed',
  templateUrl: './producto.client.view.routed.component.html',
  styleUrls: ['./producto.client.view.routed.component.css'],
  imports: [RouterModule]
})
export class ProductoClientViewRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oProducto: IProducto = {} as IProducto;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;
  serverURL: string = serverURL;
  
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

        this.oProductoService.getImagen(this.id).subscribe({
          next: (data) => {
            this.oProducto.imagen = data;
          },
        })
      },
    });
  }
}
