import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IUsuario } from '../../../../model/usuario.interface';
import { UsuarioService } from '../../../../service/usuario.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SHA256 } from 'crypto-js';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CryptoService } from '../../../../service/crypto.service';
import { ModalGenericoComponent } from "../../../shared/modals/modal/modal.component";


@Component({
  selector: 'app-usuario.client.changePassword.routed',
  templateUrl: './usuario.client.changePassword.routed.component.html',
  styleUrls: ['./usuario.client.changePassword.routed.component.css'],
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule, ModalGenericoComponent]
})
export class UsuarioClientChangePasswordRoutedComponent implements OnInit {

  id: number = 0;
  oUsuario: IUsuario = {} as IUsuario;
  formPassword: FormGroup;

  mostrarModal : boolean = false;
  redigir : boolean = false;

  tipoModal: 'info' | 'confirmacion' | 'cantidad' = 'info';
  titulo = '';
  mensaje = '';
  cantidadInicial = 1;
  accion: 'comprar' | 'vaciar' | 'eliminar' = 'comprar';


  constructor(
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oUsuarioService: UsuarioService,
    private oCryptoService: CryptoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { 
    this.id = this.oActivatedRoute.snapshot.params['id'];

     this.formPassword = this.fb.group(
      {
        actual: ['', Validators.required],
        nueva: ['', [Validators.required, Validators.minLength(3)]],
        confirmar: ['', Validators.required]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit() {
   
    this.getOne();
    //this.createForm();
  }

  getOne() {
    this.oUsuarioService.get(this.id).subscribe({
      next: (data: IUsuario) => {
        this.oUsuario = data;
      },
    });
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const nueva = group.get('nueva')?.value;
    const confirmar = group.get('confirmar')?.value;
    return nueva === confirmar ? null : { mismatch: true };
  }

cambiarContrasena(): void {
  if (this.formPassword.invalid) return;

  const actual = this.oCryptoService.getHashSHA256(this.formPassword.value.actual);
  const nueva = this.oCryptoService.getHashSHA256(this.formPassword.value.nueva);

  this.oUsuarioService.cambiarPassword(this.id, actual, nueva).subscribe({
    next: () => {
      console.log('Contraseña cambiada con éxito');
      this.redigir = true;
      this.abrirModalInfo('¡Genial!','Tu contraseña ha sido actualizada');
      this.mostrarModal = true;
    },
    error: (err) => {
      const msg =
          err.status === 404
          ? 'Usuario no encontrado'
          :err.status === 406
          ? 'Contraseña actual incorrecta'
          : 'Error al cambiar la contraseña. Contraseña actual incorrecta';
      this.abrirModalInfo('Vaya...',msg);
      this.mostrarModal = true;
    }
  });
}

 
  goBack(){
    this.oRouter.navigate(['/usuario/client/view/' + this.oUsuario?.id]);
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
      this.oRouter.navigate(['/usuario/client/view/' + this.oUsuario?.id]);
    }
  }

  confirmarModal(valor: any) {
    this.cerrarModal();
  }



}
