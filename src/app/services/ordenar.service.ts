import { Injectable } from '@angular/core';
import { IUsuario } from '../model/usuario.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdenarService {

constructor(private oHttp: HttpClient) { }

ordenar(page:number ,size: number,columna: string, manera: string): Observable<IPage<IUsuario>> {

  return this.oHttp.get<IPage<IUsuario>>(
      'http://localhost:8085' + '/usuario?page=' + page + '&size=' + size + '&sort=' + columna + ',' + manera
  );

}
}
