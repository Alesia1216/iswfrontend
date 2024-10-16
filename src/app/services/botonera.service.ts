import { Injectable } from '@angular/core';
import { IUsuario } from '../model/usuario.interface';
import { IPage } from '../model/model.interface';

@Injectable({
  providedIn: 'root'
})
export class BotoneraService {


constructor() { }

getBotonera(numPage: number, numPages:number) : string[] { //numPage 0based-server_count

  let paginaCliente = numPage + 1;
  let arrBotonera : string[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (i == 1) {
      arrBotonera.push('1');
    } else if (i >= paginaCliente - 2 && i <= paginaCliente - -2) {
      arrBotonera.push(i.toString());
    } else if (i == numPages) {
      arrBotonera.push(numPages.toString());
    } else if (i == paginaCliente - 3 || i == paginaCliente - -3) {
      arrBotonera.push('...');
    }
  }

  console.log(arrBotonera);
  return arrBotonera;
}

}
