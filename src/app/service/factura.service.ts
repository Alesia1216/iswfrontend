import { Injectable } from '@angular/core';
import { IFactura } from '../model/factura.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { httpOptions, serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
serverURL: string = serverURL + '/factura';
  constructor(private oHttp: HttpClient) { }

 getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IFactura>> {
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
    return this.oHttp.get<IPage<IFactura>>(URL, httpOptions);
  }

  getHistorial(
      id_usuario: number,
      page: number,
      size: number,
      field: string,
      dir: string,
      filtro: string
    ): Observable<IPage<IFactura>> {
      let URL: string = '';
      URL += this.serverURL;
      URL += '/getHistorial/' + id_usuario;
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
      return this.oHttp.get<IPage<IFactura>>(URL, httpOptions);
    }

  get(id: number): Observable<IFactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<IFactura>(URL);
  }

  create(oFactura: IFactura): Observable<IFactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<IFactura>(URL, oFactura);
  }

  update(oFactura: IFactura): Observable<IFactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<IFactura>(URL, oFactura);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }


}
