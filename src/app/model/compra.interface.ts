import { DateTime } from "luxon";
import { IProducto } from "./producto.interface";
import { IUsuario } from "./usuario.interface";

export interface ICompra {
    id: number;
    fecha: DateTime;
    usuario: IUsuario;
    producto: IProducto;
}