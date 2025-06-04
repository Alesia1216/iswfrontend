import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { ICarrito } from '../../../../model/carrito.interface';
import { IPage } from '../../../../model/model.interface';
import { forkJoin, Observable, Subject } from 'rxjs';
import { CarritoService } from '../../../../service/carrito.service';
import { BotoneraService } from '../../../../service/botonera.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IUsuario } from '../../../../model/usuario.interface';
import { SessionService } from '../../../../service/session.service';
import { UsuarioService } from '../../../../service/usuario.service';
import { FacturaService } from '../../../../service/factura.service';
import { LineafacturaService } from '../../../../service/lineafactura.service';
import { IFactura } from '../../../../model/factura.interface';
import { ILineafactura } from '../../../../model/lineafactura.interface';
import { DateTime } from 'luxon';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { ModalGenericoComponent } from "../../../shared/modals/modal/modal.component";

@Component({
  selector: 'app-carrito.client.plist.routed',
  templateUrl: './carrito.client.plist.routed.component.html',
  styleUrls: ['./carrito.client.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe, ModalGenericoComponent],
  providers: [DatePipe],
  standalone: true
})
export class CarritoClientPlistRoutedComponent implements OnInit {

 oPage: IPage<ICarrito> = {} as IPage<ICarrito>;
 oUsuario: IUsuario = {} as IUsuario;
 oFactura: IFactura = {} as IFactura;
 oLineafactura : ILineafactura = {} as ILineafactura;
 productoSeleccionado: IProducto | null = null;
 email: string = '';
 activeSession: boolean = false;

 onYesCallback: () => void = () => {}; // Función que se ejecutará si dice "Sí"
 //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  strField: string = '';
  strDir: string = '';
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  allCarritoLines: ICarrito[] = [];

  private debounceSubject = new Subject<string>();

  mostrarModal = false;
  tipoModal: 'info' | 'confirmacion' | 'cantidad' = 'info';
  titulo = '';
  mensaje = '';
  cantidadInicial = 1;
  accion: 'comprar' | 'vaciar' | 'eliminar' = 'comprar';

  constructor(

    private oCarritoService: CarritoService,
    private oSessionService: SessionService,
    private oUsuarioService: UsuarioService,
    private oProductoService: ProductoService,
    private oFacturaService: FacturaService,
    private oLineafacturaService: LineafacturaService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router
  ) { 
    this.activeSession = this.oSessionService.isSessionActive();
    if(this.activeSession){
      this.email = this.oSessionService.getSessionEmail();
      this.getUsuarioSession();
    }

  }

  ngOnInit() {
    if (this.activeSession) {
      this.email = this.oSessionService.getSessionEmail();
      this.getUsuarioSession();
    }
  
    this.oSessionService.onLogin().subscribe({
      next: () => {
        this.activeSession = true;
        this.email = this.oSessionService.getSessionEmail();
        this.getUsuarioSession();
      }
    });
  
    this.oSessionService.onLogout().subscribe({
      next: () => {
        this.activeSession = false;
      }
    });
  }

  getPage() {
    this.oCarritoService
      .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
      .subscribe({
        next: (oPageFromServer: IPage<ICarrito>) => {

          const filteredContent = oPageFromServer.content.filter(
            (carrito) => carrito.usuario.id === this.oUsuario.id
          );
          this.oPage = {
            ...oPageFromServer, 
            content: filteredContent
          };

          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );

          console.log(this.oPage);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
  }

  getAll(){
    this.oCarritoService
    .getPage(this.nPage, this.nRpp, this.strField, this.strDir, this.strFiltro)
    .subscribe({
      next: (oPageFromServer: IPage<ICarrito>) => {
        this.allCarritoLines = [...this.allCarritoLines, ...oPageFromServer.content]; // Acumulamos los datos

        if (this.nPage < oPageFromServer.totalPages - 1) {
          this.nPage++; // Pasamos a la siguiente página
          this.getAll(); // Llamamos recursivamente hasta la última página
        } 
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error al obtener las compras:', err);
      },
    });
  }

  getUsuarioSession(){
    this.oUsuarioService.getbyEmail(this.email).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
        this.getPage();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  view(oCarrito: ICarrito) {
    this.oRouter.navigate(['/carrito/client/view/', oCarrito.id]);
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


  vaciarCarrito() {
    this.tipoModal = 'confirmacion';
    this.titulo = '¿Vaciar carrito?';
    this.mensaje = '¿Deseas vaciar todo tu carrito?';
    this.accion = 'vaciar'
    this.onYesCallback = () => {
      this.oCarritoService.deleteAllByUser(this.oUsuario.id).subscribe(() => {
        this.getPage();
      });
    };
   this.mostrarModal = true;
  }

  confirmarCompra() {
    this.tipoModal = 'confirmacion';
    this.titulo = '¿Estás seguro?';
    this.mensaje = '¿Quieres comprar todo lo que tienes en el carrito?';
    this.accion = 'comprar'
    this.onYesCallback = () => {
      this.comprar();
    };
    this.mostrarModal = true;
  }

  delete(oCarrito: ICarrito){
    // this.showModal('¿Deseas borrar el producto del carrito?', () => {
      this.oCarritoService.delete(oCarrito.id).subscribe(() => {
        this.getPage();
      });
    //});
  }

  comprar() {
    //Comprobar si hay usuario
    if (!this.oUsuario?.id) {
      console.error('Usuario no definido');
      return;
    }

    //Asegurar que el cliente quiere comprar
      const nuevaFactura = {
        fecha: DateTime.now().plus({ hours: 2 }),
        usuario: this.oUsuario,
      };
      //crear la factura
      this.oFacturaService.create(nuevaFactura).subscribe({
        next: (data: IFactura) => {
          console.log('Factura creada:', data);
          this.oFactura = data;

          const productosActualizados: Observable<any>[] = [];
          const peticiones: Observable<ILineafactura>[] = [];

          this.oPage.content.forEach((carrito: any) => {

            const cantidad = Number(carrito.cantidad);
            const stockDisponible = carrito.producto.unidades;

            //Comprobar stock de cada producto añadido al carrito
            if (cantidad > stockDisponible) {
              console.error(`No hay suficiente stock para el producto ${carrito.producto.descripcion}`);
              //this.showModal(`No hay suficientes unidades de "${carrito.producto.descripcion}". Quedan ${stockDisponible}.`);
              return;
            }
            // Rellenamos cada objeto oLineafactura
            this.oLineafactura.factura = this.oFactura;
            this.oLineafactura.producto = carrito.producto;
            this.oLineafactura.precio = Number(carrito.producto.precio);
            this.oLineafactura.cantidad = Number(carrito.cantidad);

            // Clonamos el objeto antes de enviarlo
            const lineaAEnviar = { ...this.oLineafactura };

            // Añadimos la petición
            peticiones.push(this.oLineafacturaService.create(lineaAEnviar));
          });

          // Crear líneas de factura
        forkJoin(peticiones).subscribe({
            next: (respuestas: ILineafactura[]) => {
              console.log('Líneas de factura creadas:', respuestas);
              this.oLineafactura = respuestas[respuestas.length - 1];

              // Restar unidades a productos
              for (let i = 0; i < respuestas.length; i++) {
                const respuesta = respuestas[i];
                const producto = { ...respuesta.producto };
                producto.unidades -= respuesta.cantidad;
                
              // Añadimos la petición
                productosActualizados.push(this.oProductoService.updateStock(producto));
              }

              // Actualizar productos en el backend
              forkJoin(productosActualizados).subscribe({
                next: () => {
                  console.log('Productos actualizados correctamente.');
                  this.oCarritoService.deleteAllByUser(this.oUsuario.id).subscribe(() => {
                    this.getPage();
                  });
                  // this.showModal('¡Compra realizada con éxito!');
                },
                error: (error) => {
                  console.error('Error al actualizar productos:', error);
                  // this.showModal('Error al actualizar los productos');
                }
              });
            },
            error: (error) => {
              console.error('Error al crear líneas de factura:', error);
              // this.showModal('Error al crear líneas de factura');
            }
          });
        },
        error: (error) => {
          console.error('Error al crear factura:', error);
          // this.showModal('Error al crear factura');
        }
      });
  }

  getTotalCarrito(): number {
    return this.oPage.content?.reduce((total, item) => {
      const precioUnitario = Number(item.producto.precio);
      const cantidad = Number(item.cantidad);
      return total + (precioUnitario * cantidad);
    }, 0) || 0;
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
    this.mensaje = '¿Quieres comprar todo lo que tienes en el carrito?';
    this.mostrarModal = true;
  }

  cerrarModal(esConfirmacion: boolean) { 
    this.mostrarModal = false; 
    if (!esConfirmacion) return;
    if(this.accion === 'comprar'){
      console.log('accion comprar');
      
      this.abrirModalInfo('Compra realizada con éxito. La artista se pondrá en contacto contigo para gestionar el pago. Gracias por tu compra');
    }
    if(this.accion === 'vaciar'){
            console.log('accion vaciar');

      this.abrirModalInfo('Carrito vaciado con éxito');
    }
  }

  confirmarModal(valor: any) {
    if (this.tipoModal === 'confirmacion' && valor === true && this.onYesCallback) {
      this.onYesCallback();
    }
    this.cerrarModal(valor);
  }

}

