import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IUsuario } from '../model/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { IPage } from '../model/model.interface';

@Injectable({
    providedIn: 'root',
})
export class UsuarioService {

constructor(private oHttp: HttpClient) { }


getPage(page: number, size: number): Observable<IPage<IUsuario>> {

    return this.oHttp.get<IPage<IUsuario>>(
        'http://localhost:8085' + '/usuario?page=' + page + '&size=' + size
    );

}

}
