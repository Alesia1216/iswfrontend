import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';
import { TipousuarioService } from '../../../../service/tipousuario.service';
import { ITipousuario } from '../../../../model/tipousuario.interface';

declare let bootstrap: any;

@Component({
  selector: 'app-usuario.admin.create.routed',
  templateUrl: './usuario.admin.create.routed.component.html',
  styleUrls: ['./usuario.admin.create.routed.component.css'],
  standalone: true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule]
})
export class UsuarioAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oUsuarioForm: FormGroup | undefined = undefined;
  tiposDeUsuario: ITipousuario[] = [];  // Propiedad para almacenar los tipos de usuario
  oUsuario: IUsuario | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oUsuarioService: UsuarioService,
    private oRouter: Router,
    private oTipousuarioService: TipousuarioService
  ) { }

  ngOnInit() {
    this.createForm();
    this.oUsuarioForm?.markAllAsTouched();
    this.loadTiposDeUsuario();
  }

  createForm() {
    this.oUsuarioForm = new FormGroup({
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
      apellido2: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.min(3), Validators.maxLength(50), Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(1)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
      direccion: new FormControl('', [Validators.required, Validators.min(3), Validators.maxLength(50)]),
      tipousuario: new FormControl('', [Validators.required])
    });
  }

  updateForm() {
    this.oUsuarioForm?.controls['nombre'].setValue('');
    this.oUsuarioForm?.controls['apellido1'].setValue('');
    this.oUsuarioForm?.controls['apellido2'].setValue('');
    this.oUsuarioForm?.controls['email'].setValue('');
    this.oUsuarioForm?.controls['password'].setValue('');
    this.oUsuarioForm?.controls['telefono'].setValue('');
    this.oUsuarioForm?.controls['direccion'].setValue('');
    this.oUsuarioForm?.controls['tipousuario'].setValue('');
  }

  loadTiposDeUsuario() {
    this.oTipousuarioService.getPage(0, 10, '', 'asc', '').subscribe({
      next: (data) => {
        this.tiposDeUsuario = data.content; // Asigna la lista de tipos de usuario
      },
      error: (err) => {
        console.error('Error al cargar los tipos de usuario', err);
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

  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/usuario/admin/view/' + this.oUsuario?.id]);
  }

  onSubmit() {
    console.log(this.oUsuarioForm?.value);
    if (this.oUsuarioForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
      const formValue = { ...this.oUsuarioForm?.value };
      const selectedTipoUsuario = this.tiposDeUsuario.find(
        (tipo) => tipo.id === formValue.tipousuario
      );
      if (selectedTipoUsuario) {
        formValue.tipousuario = selectedTipoUsuario; // Establece el objeto completo
      }
      this.oUsuarioService.create(this.oUsuarioForm?.value).subscribe({
        next: (oUsuario: IUsuario) => {
          this.oUsuario = oUsuario;
          this.showModal('Usuario ' + this.oUsuario.nombre + ' creado');
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Error al crear el usuario');
          console.log(err);
        },
      });
    }
  }

}