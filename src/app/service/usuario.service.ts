import { Injectable } from '@angular/core';
import { IUsuario } from '../model/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { httpOptions, serverURL } from '../environment/environment';
import { Observable } from 'rxjs';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 serverURL: string = serverURL + '/usuario';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IUsuario>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<IUsuario>>(URL, httpOptions);
  }

  get(id: number): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<IUsuario>(URL);
  }

  getbyEmail(email: string): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/getbyemail/' + email;
    return this.oHttp.get<IUsuario>(URL);
  }

  create(oUsuario: IUsuario): Observable<IUsuario> {
    
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<IUsuario>(URL, oUsuario);
  }

  update(oUsuario: IUsuario): Observable<IUsuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<IUsuario>(URL, oUsuario);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

}