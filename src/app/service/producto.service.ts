import { Injectable } from '@angular/core';
import { IProducto } from '../model/producto.interface';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../model/model.interface';
import { httpOptions, serverURL } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  serverURL: string = serverURL + '/producto';

  constructor(private oHttp: HttpClient) { }

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IProducto>> {
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
    return this.oHttp.get<IPage<IProducto>>(URL, httpOptions);
  }

  get(id: number): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IProducto>(URL);
  }

  create(oUsuario: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IProducto>(URL, oUsuario);
  }

  update(oUsuario: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.post<IProducto>(URL, oUsuario);
  }

  getOne(id: number): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IProducto>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete(this.serverURL + '/' + id);
  }

}