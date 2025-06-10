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
import { CryptoService } from '../../../../service/crypto.service';
import { ModalGenericoComponent } from "../../../shared/modals/modal/modal.component";


@Component({
  selector: 'app-usuario.client.create.routed',
  templateUrl: './usuario.client.create.routed.component.html',
  styleUrls: ['./usuario.client.create.routed.component.css'],
  standalone: true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, ModalGenericoComponent]
})
export class UsuarioClientCreateRoutedComponent implements OnInit {
  id: number = 0;
  oUsuarioForm: FormGroup | undefined = undefined;
  tiposDeUsuario: ITipousuario[] = [];  // Propiedad para almacenar los tipos de usuario
  oUsuario: IUsuario | null = null;
  strMessage: string = '';

  form: FormGroup = new FormGroup({});

  mostrarModal : boolean = false;
  mostrarTerminos : boolean = false;
  redigir : boolean = false;

  tipoModal: 'info' | 'confirmacion' | 'cantidad' = 'info';
  titulo = '';
  mensaje = '';
  cantidadInicial = 1;
  accion: 'comprar' | 'vaciar' | 'eliminar' = 'comprar';

  constructor(
    private oUsuarioService: UsuarioService,
    private oRouter: Router,
    private oTipousuarioService: TipousuarioService,
    private oCryptoService: CryptoService
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
      password: new FormControl('', [Validators.required, Validators.min(4)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
      direccion: new FormControl('', [Validators.required, Validators.min(3), Validators.maxLength(60)]),
      tipousuario: new FormControl('')
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

  onReset() {
    this.updateForm();
    return false;
  }

  onSubmit() {
    if (this.oUsuarioForm?.invalid) {
      this.mostrarModal = true;
      this.mostrarTerminos = false;
      this.redigir = false;
      this.abrirModalInfo('Vaya... Parece que hubo un problema','Formulario inválido. Porfavor revise los datos');
      return;
    } else {
      const formValue = { ...this.oUsuarioForm?.value }; 
        formValue.password = this.oCryptoService.getHashSHA256(formValue.password); 
        formValue.tipousuario = { id: 2 };
      this.oUsuarioService.create(formValue).subscribe({
        next: (oUsuario: IUsuario) => {
          this.oUsuario = oUsuario;
          this.mostrarModal = true;
          this.mostrarTerminos = true;
          this.redigir = true;
          this.abrirModalInfo('Bienvenid@ a IswArt','Gracias por registrarte en nuestra página ' + this.oUsuario.nombre );
        },
        error: (err: HttpErrorResponse) => {
          this.mostrarModal = true;
          this.mostrarTerminos = false;
          this.redigir = false;
          console.log('Error al crear el usuario: ' + err.error.message);
          this.abrirModalInfo('Vaya... Parece que hubo un problema','Ha habido un problema creado el usuario');
        },
      });
    }
  }

  abrirModalInfo(titulo: string, mensaje: string) {
      console.log('Mostrando modal con título:', titulo); // <- ¿se imprime?
      this.tipoModal = 'info';
      this.titulo = titulo;
      this.mensaje = mensaje;
  }
  
  cerrarModal() { 
    this.mostrarModal = false; 
    if (this.redigir) {
      this.oRouter.navigate(['/login']);
    }
  }

  confirmarModal(valor: any) {
    this.cerrarModal();
  }

}