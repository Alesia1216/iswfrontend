import { Injectable } from '@angular/core';
import { ILineafactura } from '../model/lineafactura.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LineafacturaService {
serverURL: string = serverURL + '/lineafactura';
  constructor(private oHttp: HttpClient) { }

 getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<ILineafactura>> {
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
    return this.oHttp.get<IPage<ILineafactura>>(URL, httpOptions);
  }

  get(id: number): Observable<ILineafactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id;
    return this.oHttp.get<ILineafactura>(URL);
  }

  create(oLineafactura: ILineafactura): Observable<ILineafactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<ILineafactura>(URL, oLineafactura);
  }

  update(oLineafactura: ILineafactura): Observable<ILineafactura> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<ILineafactura>(URL, oLineafactura);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

}
