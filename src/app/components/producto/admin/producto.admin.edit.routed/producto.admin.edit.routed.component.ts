import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

declare let bootstrap: any;

@Component({
    selector: 'app-producto.admin.edit.routed',
    templateUrl: './producto.admin.edit.routed.component.html',
    styleUrls: ['./producto.admin.edit.routed.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      ReactiveFormsModule,
      RouterModule,
    ],
})
export class ProductoAdminEditRoutedComponent implements OnInit {

  id: number = 0;
  oProductoForm: FormGroup | undefined = undefined;
  oProducto: IProducto | null = null;
  strMessage: string = '';

  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oRouter: Router,
    private oProductoService: ProductoService
  ) { 

    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });

  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oProductoForm?.markAllAsTouched();
  }

  createForm() {
    this.oProductoForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      estilo: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      unidades: new FormControl('', [Validators.required, Validators.min(1)]),
      precio: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  onReset() {
    this.oProductoService.get(this.id).subscribe({
      next: (oProducto: IProducto) => {
        this.oProducto = oProducto;
        this.updateForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {

    const estilosValidos = ['personaje', 'paisaje', 'concepto', 'variado'];
    const estilo = estilosValidos.includes(this.oProducto?.estilo?.toLowerCase() ?? '')
    ? this.oProducto?.estilo?.toLowerCase()
    : null;
    this.oProductoForm?.patchValue({
    id: this.oProducto?.id,
    descripcion: this.oProducto?.descripcion,
    estilo: estilo,
    unidades: this.oProducto?.unidades,
    precio: this.oProducto?.precio,
    });
  }

  get() {
    this.oProductoService.get(this.id).subscribe({
      next: (oProducto: IProducto) => {
        this.oProducto = oProducto;
        this.updateForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
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

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/producto/admin/view/' + this.oProducto?.id]);
  };

  onSubmit() {
    if (!this.oProductoForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oProductoService.update(this.oProductoForm?.value).subscribe({
        next: (oProducto: IProducto) => {
          this.oProducto = oProducto;
          this.updateForm();
          this.showModal('Producto ' + this.oProducto.descripcion + ' actualizado');
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Error al actualizar el producto: '+ err.error.message);
        },
      });
    }
  }
}