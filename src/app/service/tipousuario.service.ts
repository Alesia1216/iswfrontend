import { Injectable } from '@angular/core';
import { ITipousuario } from '../model/tipousuario.interface';
import { HttpClient } from '@angular/common/http';
import { httpOptions, serverURL } from '../environment/environment';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipousuarioService {
 serverURL: string = serverURL + '/tipousuario';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ITipousuario>> {
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
    return this.oHttp.get<IPage<ITipousuario>>(URL, httpOptions);
  }

  get(id: number): Observable<ITipousuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<ITipousuario>(URL);
  }

  create(oTipousuario: ITipousuario): Observable<ITipousuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<ITipousuario>(URL, oTipousuario);
  }

  update(oTipousuario: ITipousuario): Observable<ITipousuario> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<ITipousuario>(URL, oTipousuario);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

}
