import { Injectable } from '@angular/core';
import { IJwt } from '../model/jwt.interface';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

constructor() { }

  //login
  setToken(strToken: string): void {
    localStorage.setItem('token', strToken);
  }

  //logout
  deleteToken(): void {
    localStorage.removeItem('token');
  }


  isSessionActive(): boolean {
    //return this.getToken() != null;
    const token = this.getToken();
    if (token) {
      let parsedToken = this.parseJwt(token);
      const now = Date.now() / 1000;
      if (parsedToken.exp > now) {
        return true;
      }else{
        this.deleteToken();
        return false;
      }
    }else{
      return false;
    }
  }

  getSessionEmail(): string {
    const token = this.getToken();
    if (token) {
      if(this.isSessionActive()){
        let parsedToken : IJwt = this.parseJwt(token);
        return parsedToken.email;
      }else{
        return '';
      }
    }else{
      return '';
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }


  private parseJwt (token: string) : IJwt {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

}
