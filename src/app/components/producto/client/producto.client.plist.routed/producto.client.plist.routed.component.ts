import { ILineafactura } from './../../../../model/lineafactura.interface';
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime, forkJoin, Subject } from 'rxjs';

import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { IPage } from '../../../../model/model.interface';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { BotoneraService } from '../../../../service/botonera.service';
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { IUsuario } from '../../../../model/usuario.interface';
import { CarritoService } from '../../../../service/carrito.service';
import { ICarrito } from '../../../../model/carrito.interface';
import { serverURL } from '../../../../environment/environment';
import { DateTime } from 'luxon';
import { IFactura } from '../../../../model/factura.interface';
import { FacturaService } from '../../../../service/factura.service';
import { LineafacturaService } from '../../../../service/lineafactura.service';
import { ModalGenericoComponent } from "../../../shared/modals/modal/modal.component";

@Component({
    selector: 'app-producto.client.plist.routed',
    templateUrl: './producto.client.plist.routed.component.html',
    styleUrls: ['./producto.client.plist.routed.component.css'],
    imports: [CommonModule, FormsModule, TrimPipe, RouterModule, ModalGenericoComponent]
})
export class ProductoClientPlistRoutedComponent implements OnInit {

  oPage: IPage<IProducto> | null = null;
  oUsuario : IUsuario = {} as IUsuario;
  oCarrito : ICarrito = {} as ICarrito;
  productoSeleccionado: IProducto  = {} as IProducto;
  cantidadSeleccionada : number = 1;
  serverURL: string = serverURL;
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

  mostrarModal = false;
  tipoModal: 'info' | 'confirmacion' | 'cantidad' = 'info';
  titulo = '';
  mensaje = '';
  cantidadInicial = 1;

  constructor(
    private oProductoService: ProductoService,
    private oBotoneraService: BotoneraService,
    private oSessionService: SessionService,
    private oUsuarioService : UsuarioService,
    private oCarritoService: CarritoService,
    private oFacturaService: FacturaService,
    private oLineafacturaService: LineafacturaService
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

  addCarrito(){

    if (!this.productoSeleccionado?.id || this.cantidadSeleccionada <= 0) {
      console.warn('Producto inválido o cantidad no válida');
      return;
    }

    console.log(this.oUsuario);
    console.log(this.productoSeleccionado);
    console.log(this.cantidadSeleccionada);

    this.oCarrito.usuario = this.oUsuario;
    this.oCarrito.producto = this.productoSeleccionado;
    this.oCarrito.cantidad = this.cantidadInicial;

    this.oCarritoService.create(this.oCarrito).subscribe({
      next: (data: ICarrito) => {
        console.log('Producto añadido con éxito');
      },
      error: (err: HttpErrorResponse) => {
        console.log('Fallo al añadir el producto');
      },
    })
  }

  comprar(producto: IProducto) {
  // Verificar usuario
  if (!this.oUsuario?.id) {
    console.error('Usuario no definido');
    return;
  }

  // Verificar stock
  if (producto.unidades < 1) {
    console.error(`No hay stock disponible para el producto "${producto.descripcion}"`);
    return;
  }

  // Crear factura
  const nuevaFactura: IFactura = {
    fecha: DateTime.now().plus({ hours: 2 }),
    usuario: this.oUsuario,
  };

  this.oFacturaService.create(nuevaFactura).subscribe({
    next: (facturaCreada: IFactura) => {
      console.log('Factura creada:', facturaCreada);

      const lineaFactura: ILineafactura = {
        factura: facturaCreada,
        producto: producto,
        precio: producto.precio,
        cantidad: 1, // por defecto 1 unidad
      };

      // Crear línea de factura
      this.oLineafacturaService.create(lineaFactura).subscribe({
        next: (lineaCreada: ILineafactura) => {
          console.log('Línea de factura creada:', lineaCreada);

          // Actualizar stock
          const productoActualizado = { ...producto, unidades: producto.unidades - 1 };
          this.oProductoService.updateStock(productoActualizado).subscribe({
            next: () => {
              console.log('Stock actualizado correctamente');
              this.getPage(); // refrescar productos
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error al actualizar el stock del producto:', error);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al crear la línea de factura:', error);
        }
      });
    },
    error: (error: HttpErrorResponse) => {
      console.error('Error al crear la factura:', error);
    }
  });
}

abrirModalInfo(mensaje: string) {
  this.tipoModal = 'info';
  this.titulo = '¡Genial!';
  this.mensaje = mensaje;
  this.mostrarModal = true;
}

abrirModalConfirmacion(producto : IProducto) {
  this.tipoModal = 'confirmacion';
  this.titulo = '¿Estás seguro?';
  this.mensaje = '¿Quieres comprar una unidad de '+ producto.descripcion + '?';
  this.productoSeleccionado = producto;
  this.mostrarModal = true;
}

abrirModalCantidad(producto : IProducto) {
  this.tipoModal = 'cantidad';
  this.titulo = 'Selecciona cantidad';
  this.mensaje = '¿Cuántos productos deseas añadir al carrito?';
  this.cantidadInicial = 1;
  this.productoSeleccionado = producto;
  this.mostrarModal = true;
}

cerrarModal(valor: any) {  
  console.log('Cerrado con valor:', valor);
  this.mostrarModal = false;
  if(this.tipoModal === 'cantidad' && valor > 0){
    this.abrirModalInfo('Producto agregado al carrito');
  }
  if(this.tipoModal === 'confirmacion' && valor === true){
      this.abrirModalInfo('Producto comprado con éxito. Gracias por tu compra. La artista se pondrá en contacto contigo para gestionar el pago.');
  }
}

confirmarModal(valor: any) {
  console.log('Confirmado con valor:', valor);
  if (this.tipoModal === 'confirmacion' && valor === true) {
    this.comprar(this.productoSeleccionado);
  }
  if (this.tipoModal === 'cantidad' && valor > 0) {
    this.cantidadInicial = valor;
    this.addCarrito();
  }
  this.cerrarModal(valor);
}

}
