import { Injectable } from '@angular/core';
import { IJwt } from '../model/jwt.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  subjectLogin: Subject<string> = new Subject<string>();
  subjectLogout: Subject<string> = new Subject<string>();

  constructor() { }

  //login
  private setToken(strToken: string): void {
    localStorage.setItem('token', strToken);
  }

  //logout
  private deleteToken(): void {
    localStorage.removeItem('token');
  }


  isSessionActive(): boolean {
    const token = this.getToken();
    if (token) {
      let parsedToken = this.parseJwt(token);
      const now = Date.now() / 1000;
      if (parsedToken.exp > now) {
        return true;
      } else {
        this.deleteToken();
        return false;
      }
    } else {
      return false;
    }
  }

  getSessionEmail(): string {
    const token = this.getToken();
    if (token) {
      if (this.isSessionActive()) {
        let parsedToken: IJwt = this.parseJwt(token);
        return parsedToken.email;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }


  private parseJwt(token: string): IJwt {
    var base64Url = token.split('.')[1];
    if (base64Url === undefined) {
      console.log('Token invalido');
      // create empty IJwt
      return { jti: '', email: '', sub: '', iss: '', iat: 0, exp: 0 };
    } else {
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    }
  }

  onLogin(): Subject<string> {
    return this.subjectLogin;
  }

  onLogout(): Subject<string> {
    return this.subjectLogout;
  }

  login(strToken: string): void {
    this.setToken('token');
    this.subjectLogin.next('login');
  }

  logout(): void {
    this.deleteToken();
    this.subjectLogout.next('logout');
  }


}
