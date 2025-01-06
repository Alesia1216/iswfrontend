import { Component, OnInit } from '@angular/core';
import { RouterModule} from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,  
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { IProducto } from '../../../../model/producto.interface';
import { ProductoService } from '../../../../service/producto.service';
import { HttpErrorResponse } from '@angular/common/http';

declare let bootstrap: any;
@Component({
  selector: 'app-producto.admin.create.routed',
  templateUrl: './producto.admin.create.routed.component.html',
  styleUrls: ['./producto.admin.create.routed.component.css'],
  standalone: true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule]
})

export class ProductoAdminCreateRoutedComponent implements OnInit {

  id: number = 0;
  oProductoForm: FormGroup | undefined = undefined;
  oProducto: IProducto | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oProductoService: ProductoService,
    private oRouter: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.oProductoForm?.markAllAsTouched();
  }

  createForm() {
    this.oProductoForm = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      apellido1: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      apellido2: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      id_tipousuario: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  updateForm() {
    this.oProductoForm?.controls['nombre'].setValue('');
    this.oProductoForm?.controls['apellido1'].setValue('');
    this.oProductoForm?.controls['apellido2'].setValue('');
    this.oProductoForm?.controls['email'].setValue('');
    this.oProductoForm?.controls['id_tipousuario'].setValue('');
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/producto/admin/view/' + this.oProducto?.id]);
  }

  onSubmit() {
    if (this.oProductoForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {      
      this.oProductoService.create(this.oProductoForm?.value).subscribe({
        next: (oProducto: IProducto) => {
          this.oProducto = oProducto;
          this.showModal('Usuario creado con el id: ' + this.oProducto.id);
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Error al crear el usuario');
          console.log(err);
        },
      });
    }
  }

}