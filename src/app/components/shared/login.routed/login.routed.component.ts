import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa este módulo
import { LoginService } from '../../../service/login.service';
import { ILogindata } from '../../../model/logindata.interface';
import { SessionService } from '../../../service/session.service';
import { IJwt } from '../../../model/jwt.interface';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../../service/crypto.service';

@Component({
  selector: 'app-login.routed',
  templateUrl: './login.routed.component.html',
  styleUrls: ['./login.routed.component.css'],
  imports: [ ReactiveFormsModule, RouterLink ],
  standalone: true,
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;

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
          alert('Bienvenid@ a IswArt');
          this.oRouter.navigate(['/shared/menu']);
        },
        error: (err) => {
          alert('No has podido loguearte, revisa el email y la contraseña porfavor');
        }
      });
    } else {
      console.log('Form is invalid.');
    }
  }
}
