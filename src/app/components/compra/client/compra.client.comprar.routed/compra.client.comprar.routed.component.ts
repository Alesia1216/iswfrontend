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

declare let bootstrap: any;

@Component({
  selector: 'app-compra.client.comprar.routed',
  templateUrl: './compra.client.comprar.routed.component.html',
  styleUrls: ['./compra.client.comprar.routed.component.css'],
  imports: [RouterLink],
  standalone: true
})
export class CompraClientComprarRoutedComponent implements OnInit {

  id: number = 0;
  oProducto: IProducto = {} as IProducto;
  oUsuario: IUsuario = {} as IUsuario;
  oCompra: ICompra = {} as ICompra;

  strMessage: string = '';
  myModal: any;
  
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
        this.showModal(
          '¡Muchas gracias por tu compra! La artista se pondrá en contacto contigo para gestionar el pago'
        );
        this.oRouter.navigate(['/producto/client/plist']);
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/shared/menu']);
  }

}
