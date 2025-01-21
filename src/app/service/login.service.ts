import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ILogindata } from '../model/logindata.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  serverURL: string = serverURL + '/auth';

  constructor(private oHttp: HttpClient) { }

  login(oLogindata: ILogindata) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/login';
    return this.oHttp.post<string>(URL, oLogindata);
  }

}
