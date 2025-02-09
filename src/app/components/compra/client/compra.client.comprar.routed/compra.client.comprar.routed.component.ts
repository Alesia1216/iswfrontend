import { Component, OnInit } from '@angular/core';
import { IProducto } from '../../../../model/producto.interface';
import { IUsuario } from '../../../../model/usuario.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../../../service/producto.service';
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { CompraService } from '../../../../service/compra.service';
import { ICompra } from '../../../../model/compra.interface';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-compra.client.comprar.routed',
  templateUrl: './compra.client.comprar.routed.component.html',
  styleUrls: ['./compra.client.comprar.routed.component.css'],
  imports: [RouterLink]
})
export class CompraClientComprarRoutedComponent implements OnInit {

  id: number = 0;
  oProducto: IProducto = {} as IProducto;
  oUsuario: IUsuario = {} as IUsuario;
  oCompra: ICompra = {} as ICompra;
  
  constructor(    
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router, 
    private oProductoService: ProductoService,
    private oSessionService: SessionService,
    private oUsuarioService: UsuarioService,
    private oCompraService: CompraService
  ) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getProduct();
    this.getUser();
  }

  getProduct() {
    this.oProductoService.get(this.id).subscribe({
      next: (data: IProducto) => {
        this.oProducto = data;
      },
    });
  }

  getUser(){
    let email: string = this.oSessionService.getSessionEmail();

    this.oUsuarioService.getbyEmail(email).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  comprar(){

    //this.oCompra.fecha = DateTime.now().setZone("local");
    //const now = DateTime.now().setZone("Europe/Madrid");
    //console.log("Fecha con zona horaria:", now.toISO());
    this.oCompra.fecha = DateTime.now().plus({ hours: 1 }); 
    //esto lo hago porque la zona horaria es UTC y para que este en la nuestra debe ser +1
    this.oCompra.producto = this.oProducto;
    this.oCompra.usuario = this.oUsuario;

    this.oCompraService.create(this.oCompra).subscribe({
      next: (data: any) => {
        this.oProducto.unidades = this.oProducto.unidades - 1;
        this.oProductoService.updateStock(this.oProducto).subscribe({
          next: (data: any) => {
            console.log(data);
          },
          error: (err) => {
            console.log(err);
          }
        });
        alert('¡Muchas gracias por tu compra!');
        this.oRouter.navigate(['/producto/client/plist']);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

}
