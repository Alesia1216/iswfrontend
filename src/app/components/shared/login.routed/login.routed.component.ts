import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa este módulo
import { LoginService } from '../../../service/login.service';
import { ILogindata } from '../../../model/logindata.interface';
import { SessionService } from '../../../service/session.service';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../../service/crypto.service';
import { CommonModule } from '@angular/common';
import { ModalGenericoComponent } from "../modals/modal/modal.component";

declare let bootstrap: any;

@Component({
  selector: 'app-login.routed',
  templateUrl: './login.routed.component.html',
  styleUrls: ['./login.routed.component.css'],
  imports: [ReactiveFormsModule, RouterLink, CommonModule, ModalGenericoComponent],
  standalone: true,
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;
  showPassword = false;

  mostrarModal = false;
  tipoModal: 'info' | 'confirmacion' | 'cantidad' = 'info';
  titulo = '';
  mensaje = '';
  cantidadInicial = 1;

  constructor(
    private fb: FormBuilder,
    private oLoginService: LoginService,
    private oSessionService: SessionService,
    private oCryptoService: CryptoService,
    private oRouter: Router
  ){
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const hashedPassword = this.oCryptoService.getHashSHA256(this.loginForm.value.password); 
      this.loginForm.value.password = hashedPassword;
      const loginData: ILogindata = this.loginForm.value;
      this.oLoginService.login(loginData).subscribe({
        next: (response : string) => {
          this.oSessionService.login(response); //notificamos del log in 
          this.abrirModalInfo(
            'Sesión iniciada correctamente, bienvenid@ a IswArt'
          );
        },
        error: (err) => {
          this.abrirModalInfo(
            'No has podido loguearte, revisa el email y la contraseña porfavor'
          );
        }
      });
    } else {
      this.abrirModalInfo(
        'Formulario invalido, revisa el email y la contraseña porfavor'
      );
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  abrirModalInfo(mensaje: string) {
    this.tipoModal = 'info';
    this.titulo = 'ISWART';
    this.mensaje = mensaje;
    this.mostrarModal = true;
  }

  cerrarModal() { 
    this.mostrarModal = false; 
    this.oRouter.navigate(['/']);
  }

  confirmarModal(valor: any) {
    this.cerrarModal();
  }

}
