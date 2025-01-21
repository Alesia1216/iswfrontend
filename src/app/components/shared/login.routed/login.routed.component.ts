import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Importa este módulo
import { LoginService } from '../../../service/login.service';
import { ILogindata } from '../../../model/logindata.interface';
import { SessionService } from '../../../service/session.service';
import { IJwt } from '../../../model/jwt.interface';

@Component({
  selector: 'app-login.routed',
  templateUrl: './login.routed.component.html',
  styleUrls: ['./login.routed.component.css'],
  imports: [ ReactiveFormsModule ],
  standalone: true,
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private oLoginService: LoginService,
    private oSessionService: SessionService
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
      const loginData: ILogindata = this.loginForm.value;
      this.oLoginService.login(loginData).subscribe({
        next: (response : string) => {
          console.log('Login successful:', response);
          this.oSessionService.setToken(response);
          //let parsedToken : IJwt = this.oSessionService.parseJwt(response);
          //console.log('Token parseado:', parsedToken);
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    } else {
      console.log('Form is invalid.');
    }
  }
}
