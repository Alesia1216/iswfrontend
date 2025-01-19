import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';

declare let bootstrap: any;

@Component({
    selector: 'app-producto.admin.delete.routed',
    templateUrl: './producto.admin.delete.routed.component.html',
    styleUrls: ['./producto.admin.delete.routed.component.css'],
    standalone: true,
    imports:[ RouterModule ] 
})
export class ProductoAdminDeleteRoutedComponent implements OnInit {

  oProducto: IProducto | null = null;
  strMessage: string = '';
  myModal: any;

  constructor(
    private oProductoService: ProductoService,
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router
  ) { }

  ngOnInit(): void {
    let id = this.oActivatedRoute.snapshot.params['id'];
    this.oProductoService.get(id).subscribe({
      next: (oProducto: IProducto) => {
        this.oProducto = oProducto;
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al cargar el producto');
      },
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  delete(): void {
    this.oProductoService.delete(this.oProducto!.id).subscribe({
      next: (data) => {
        this.showModal(
          'Producto ' + this.oProducto!.descripcion + ' ha sido borrado'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al borrar el producto');
      },
    });
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/producto/admin/plist']);
  }

}
