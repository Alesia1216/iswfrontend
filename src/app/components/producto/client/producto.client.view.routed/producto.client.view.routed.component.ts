import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { serverURL } from '../../../../environment/environment';
import { IFactura } from '../../../../model/factura.interface';
import { DateTime } from 'luxon';
import { IUsuario } from '../../../../model/usuario.interface';
import { LineafacturaService } from '../../../../service/lineafactura.service';
import { FacturaService } from '../../../../service/factura.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { SessionService } from '../../../../service/session.service';
import { ILineafactura } from '../../../../model/lineafactura.interface';

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
  oUsuario : IUsuario = {} as IUsuario;
  oLineafactura: ILineafactura = {} as ILineafactura;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;
  serverURL: string = serverURL;
  
  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oProductoService: ProductoService,
    private oSessionService: SessionService,
    private oUsuarioService: UsuarioService,
    private oFacturaService: FacturaService,
    private oLineafacturaService: LineafacturaService,
    private oRouter: Router
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

  volver(){
    this.oRouter.navigate(['/producto/client/plist']);
  }

 
}
