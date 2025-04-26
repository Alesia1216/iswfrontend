import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ICarrito } from '../model/carrito.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
 serverURL: string = serverURL + '/carrito';
  constructor(private oHttp: HttpClient) { }

 getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ICarrito>> {
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
    return this.oHttp.get<IPage<ICarrito>>(URL, httpOptions);
  }

  get(id: number): Observable<ICarrito> {
    let URL: string = this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<ICarrito>(URL);
  }

  create(oCarrito: ICarrito): Observable<ICarrito> {
    let URL: string = this.serverURL;
    URL += '/create';
    return this.oHttp.put<ICarrito>(URL, oCarrito);
  }

  update(oCarrito: ICarrito): Observable<ICarrito> {
    let URL: string = this.serverURL;
    URL += '/update';
    return this.oHttp.post<ICarrito>(URL, oCarrito);
  }

  delete(id: number) {
    let URL: string = this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

  deleteAll() {
    let URL: string = this.serverURL;
    URL += '/deleteAll';
    return this.oHttp.delete(URL);
  }

}
