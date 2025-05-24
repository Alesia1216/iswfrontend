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
    URL += '/get/' + id;
    return this.oHttp.get<IProducto>(URL);
  }

   getImagen(id: number): Observable<Blob> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/get/' + id + '/imagen';
    return this.oHttp.get(URL, { responseType: 'blob' });
  }

  create(oProducto: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/create';
    return this.oHttp.put<IProducto>(URL, oProducto);
  }

    createImagen(oProducto: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/createImagen';
    const formData = new FormData();
      formData.append('descripcion', oProducto.descripcion);
      formData.append('estilo', oProducto.estilo);
      formData.append('unidades', oProducto.unidades.toString());
      formData.append('precio', oProducto.precio.toString());
      formData.append('habilitado', oProducto.habilitado.toString());
      formData.append('imagen', oProducto.imagen as Blob);
    return this.oHttp.put<IProducto>(URL, formData);
  }

  update(oProducto: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/update';
    return this.oHttp.post<IProducto>(URL, oProducto);
  }

  updateImagen(oProducto: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/updateImagen';
     const formData = new FormData();
      formData.append('id', oProducto.id.toString());
      formData.append('descripcion', oProducto.descripcion);
      formData.append('estilo', oProducto.estilo);
      formData.append('unidades', oProducto.unidades.toString());
      formData.append('precio', oProducto.precio.toString());
      formData.append('habilitado', oProducto.habilitado.toString());
      formData.append('imagen', oProducto.imagen as Blob);
    return this.oHttp.post<IProducto>(URL, formData);
  }


  updateStock(oProducto: IProducto): Observable<IProducto> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/updatestock';
    return this.oHttp.post<IProducto>(URL, oProducto);
  }

  delete(id: number) {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/delete/' + id;
    return this.oHttp.delete(URL);
  }

}