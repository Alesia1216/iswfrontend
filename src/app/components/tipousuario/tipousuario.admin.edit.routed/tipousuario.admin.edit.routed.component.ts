import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { TipousuarioService } from '../../../service/tipousuario.service';


declare let bootstrap: any;

@Component({
    selector: 'app-tipousuario.admin.edit.routed',
    templateUrl: './tipousuario.admin.edit.routed.component.html',
    styleUrls: ['./tipousuario.admin.edit.routed.component.css'],
    standalone: true,
    imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule]
})
export class TipousuarioAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oTipousuarioForm: FormGroup | undefined = undefined;
  oTipousuario: ITipousuario | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oTipousuarioService: TipousuarioService
  ) { 
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oTipousuarioForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipousuarioForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    });
  }

  updateForm() {
    this.oTipousuarioForm?.controls['id'].setValue(this.oTipousuario?.id);
    this.oTipousuarioForm?.controls['descripcion'].setValue(this.oTipousuario?.descripcion);
  }

  get() {
    console.log(this.id);
    this.oTipousuarioService.get(this.id).subscribe({
      next: (oTipousuario: ITipousuario) => {
        this.oTipousuario = oTipousuario;
        console.log(this.oTipousuario);
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

  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/tipousuario/admin/view/' + this.oTipousuario?.id]);
  }

  onSubmit() {
    console.log(this.oTipousuarioForm?.value);
    if (this.oTipousuarioForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
      this.oTipousuarioService.update(this.oTipousuarioForm?.value).subscribe({
        next: (oTipousuario: ITipousuario) => {
          this.oTipousuario = oTipousuario;
          this.showModal('Tipo de usuario ' + this.oTipousuario.descripcion + ' actualizado');
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Error al actualizar el tipo de usuario');
          console.log(err);
        },
      });
    }
  }
  

}