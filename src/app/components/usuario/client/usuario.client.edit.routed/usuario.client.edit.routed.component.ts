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
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';
import { TipousuarioService } from '../../../../service/tipousuario.service';
import { ITipousuario } from '../../../../model/tipousuario.interface';

declare let bootstrap: any;

@Component({
    selector: 'app-usuario.client.edit.routed',
    templateUrl: './usuario.client.edit.routed.component.html',
    styleUrls: ['./usuario.client.edit.routed.component.css'],
    standalone: true,
    imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule]
})
export class UsuarioClientEditRoutedComponent implements OnInit {
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
    this.oUsuarioForm?.markAllAsTouched();
    this.loadTiposDeUsuario();

  }

  createForm() {
    this.oUsuarioForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
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
      password: new FormControl(''),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
      direccion: new FormControl('', [Validators.required, Validators.min(3), Validators.maxLength(50)]),
      tipousuario: new FormControl('')
    });
  }

  updateForm() {
    this.oUsuarioForm?.controls['id'].setValue(this.oUsuario?.id);
    this.oUsuarioForm?.controls['nombre'].setValue(this.oUsuario?.nombre);
    this.oUsuarioForm?.controls['apellido1'].setValue(this.oUsuario?.apellido1);
    this.oUsuarioForm?.controls['apellido2'].setValue(this.oUsuario?.apellido2);
    this.oUsuarioForm?.controls['email'].setValue(this.oUsuario?.email);
    this.oUsuarioForm?.controls['password'].setValue(this.oUsuario?.password);
    this.oUsuarioForm?.controls['telefono'].setValue(this.oUsuario?.telefono);
    this.oUsuarioForm?.controls['direccion'].setValue(this.oUsuario?.direccion);
    this.oUsuarioForm?.controls['tipousuario'].setValue(this.oUsuario?.tipousuario.id);
  }

  get() {
    console.log(this.id);
    this.oUsuarioService.get(this.id).subscribe({
      next: (oUsuario: IUsuario) => {
        this.oUsuario = oUsuario;
        console.log(this.oUsuario);
        this.updateForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
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
    this.oRouter.navigate(['/usuario/client/view/' + this.oUsuario?.id]);
  }

  onSubmit() {
    console.log(this.oUsuarioForm?.value);
    if (this.oUsuarioForm?.invalid) {
      this.showModal('Ups, debe de haber algún error. Revise el formulario porfavor');
      return;
    } else {
      const formValue = { ...this.oUsuarioForm?.value };
  
      // Encuentra el objeto completo de tipo de usuario basado en el ID
      const selectedTipoUsuario = this.tiposDeUsuario.find(
        (tipo) => tipo.id === formValue.tipousuario
      );
  
      if (selectedTipoUsuario) {
        formValue.tipousuario = selectedTipoUsuario; // Asigna el objeto completo
      }
  
      this.oUsuarioService.update(formValue).subscribe({
        next: (oUsuario: IUsuario) => {
          this.oUsuario = oUsuario;
          this.showModal('Genial, ha actualizado con éxito su perfil');
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Ha habido un error al actualizar su perfil: ' + err.error.message);
        },
      });
    }
  }
  

}