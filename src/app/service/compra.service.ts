import { Injectable } from '@angular/core';
import { ICompra } from '../model/compra.interface';
import { IPage } from '../model/model.interface';
import { httpOptions, serverURL } from '../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
 serverURL: string = serverURL + '/compra';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ICompra>> {
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
    return this.oHttp.get<IPage<ICompra>>(URL, httpOptions);
  }

  get(id: number): Observable<ICompra> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<ICompra>(URL);
  }

  create(oCompra: ICompra): Observable<ICompra> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<ICompra>(URL, oCompra);
  }

  update(oCompra: ICompra): Observable<ICompra> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<ICompra>(URL, oCompra);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

  getHistorial(){
    let URL: string = '';
    URL += this.serverURL;
    URL += '/historial';
    return this.oHttp.get<ICompra[]>(URL);
  }

}