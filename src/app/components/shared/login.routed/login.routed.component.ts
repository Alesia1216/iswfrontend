import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa este módulo
import { LoginService } from '../../../service/login.service';
import { ILogindata } from '../../../model/logindata.interface';
import { SessionService } from '../../../service/session.service';
import { IJwt } from '../../../model/jwt.interface';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../../service/crypto.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

declare let bootstrap: any;

@Component({
  selector: 'app-login.routed',
  templateUrl: './login.routed.component.html',
  styleUrls: ['./login.routed.component.css'],
  imports: [ ReactiveFormsModule, RouterLink, CommonModule ],
  standalone: true,
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;

  strMessage: string = '';
  myModal: any;

  showPassword = false;

  logOkay: boolean = false;

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
          this.logOkay = true;
          this.showModal(
            'Bienvenid@ a IswArt'
          );
        },
        error: (err) => {
          this.showModal(
            'No has podido loguearte, revisa el email y la contraseña porfavor'
          );
        }
      });
    } else {
      this.showModal(
        'Formulario invalido, revisa el email y la contraseña porfavor'
      );
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
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
    this.oRouter.navigate(['/shared/home']);
  }

}
