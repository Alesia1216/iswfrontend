import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrimPipe } from '../../../../pipe/trim.pipe';
import { ICarrito } from '../../../../model/carrito.interface';
import { IPage } from '../../../../model/model.interface';
import { debounceTime, forkJoin, Observable, Subject } from 'rxjs';
import { CarritoService } from '../../../../service/carrito.service';
import { BotoneraService } from '../../../../service/botonera.service';
import { ActivatedRoute, Router } from '@angular/router';
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

declare let bootstrap: any;

@Component({
  selector: 'app-carrito.client.plist.routed',
  templateUrl: './carrito.client.plist.routed.component.html',
  styleUrls: ['./carrito.client.plist.routed.component.css'],
  imports: [CommonModule, FormsModule, TrimPipe],
  providers: [DatePipe],
  standalone: true
})
export class CarritoClientPlistRoutedComponent implements OnInit {

 oPage: IPage<ICarrito> = {} as IPage<ICarrito>;
 oUsuario: IUsuario = {} as IUsuario;
 oFactura: IFactura = {} as IFactura;
 oLineafactura : ILineafactura = {} as ILineafactura;
 email: string = '';
 activeSession: boolean = false;

 strMessage: string = '';
 myModal: any;
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

  constructor(

    private oCarritoService: CarritoService,
    private oSessionService: SessionService,
    private oUsuarioService: UsuarioService,
    private oProductoService: ProductoService,
    private oFacturaService: FacturaService,
    private oLineafacturaService: LineafacturaService,
    private oBotoneraService: BotoneraService,
    private oActivatedRoute: ActivatedRoute,
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
          //if(oPageFromServer.content[x].usuario.id == this.oUsuario.id){}       
          //this.oPage = oPageFromServer;

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

  // delete(oCarrito: ICarrito) {
  //   this.oRouter.navigate(['/carrito/client/delete/', oCarrito.id]);
  // }

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

  showModal(mensaje: string, callback: () => void) {
    this.strMessage = mensaje;
    this.onYesCallback = callback;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
  }

  onYes() {
    if (this.onYesCallback) {
      this.onYesCallback(); // Ejecuta la acción que corresponda
    }
    this.hideModal();
  }

  vaciarCarrito() {
    this.showModal('¿Deseas vaciar tu carrito?', () => {
      this.oCarritoService.deleteAllByUser(this.oUsuario.id).subscribe(() => {
        this.getPage();
      });
    });
  }

  delete(oCarrito: ICarrito){
    this.showModal('¿Deseas borrar el producto del carrito?', () => {
      this.oCarritoService.delete(oCarrito.id).subscribe(() => {
        this.getPage();
      });
    });
  }

//FUNCION COMPRA PRIMERA VERSION FUNCIONAL 
//  comprar(){
//     if (!this.oUsuario?.id) {
//       //si no hay usuario definido no comprara nada
//         console.error('Usuario no definido');
//         return;
//       }

//     this.showModal('¿Deseas comprar todo lo que hay en tu carrito?', () => {
//      //si dice que si

//     const nuevaFactura = {
//       fecha:  DateTime.now().plus({ hours: 2 }), 
//       usuario: this.oUsuario,
//     };

//      this.oFacturaService.create(nuevaFactura).subscribe({
//       next: (data: IFactura) => {
//         console.log('Factura creada:', data);
//         this.oFactura = data;

//        const peticiones: Observable<ILineafactura>[] = [];

//         this.oPage.content.forEach((carrito: any) => {
//           // Rellenamos el objeto oLineafactura
//           this.oLineafactura.factura = this.oFactura;
//           this.oLineafactura.producto = carrito.producto;
//           this.oLineafactura.precio = Number(carrito.producto.precio);
//           this.oLineafactura.cantidad = Number(carrito.cantidad);

//           // Clonamos el objeto antes de enviarlo
//           const lineaAEnviar = { ...this.oLineafactura };

//           // Añadimos la petición
//           peticiones.push(this.oLineafacturaService.create(lineaAEnviar));
//         });

//         // Ejecutamos todas las creaciones en paralelo
//         forkJoin(peticiones).subscribe({
//           next: (respuestas: ILineafactura[]) => {
//             console.log('Líneas creadas:', respuestas);
//             this.oCarritoService.deleteAllByUser(this.oUsuario.id).subscribe(() => {
//               this.getPage();
//             });
//             this.oLineafactura = respuestas[respuestas.length - 1];
//             // this.showModal('¡Compra realizada con éxito!');
//           },
//           error: (error) => {
//             console.error('Error al crear líneas de factura:', error);
//             // this.showModal('Error al crear líneas de factura');
//           }
//         });
//       },
//       error: (error) => {
//         console.error('Error al crear factura:', error);
//         // this.showModal('Error al crear factura');
//       }
//     });
//   });
// }
comprar() {
  //Comprobar si hay usuario
  if (!this.oUsuario?.id) {
    console.error('Usuario no definido');
    return;
  }

  //Asegurar que el cliente quiere comprar
  this.showModal('¿Deseas comprar todo lo que hay en tu carrito?', () => {
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
              productosActualizados.push(this.oProductoService.update(producto));
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
  });
}


getTotalCarrito(): number {
  return this.oPage.content?.reduce((total, item) => {
    const precioUnitario = Number(item.producto.precio);
    const cantidad = Number(item.cantidad);
    return total + (precioUnitario * cantidad);
  }, 0) || 0;
}

}

