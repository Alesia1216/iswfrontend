import { IProducto } from "./producto.interface";
import { IUsuario } from "./usuario.interface";

export interface ICompra {
    id: number;
    fecha: Date;
    usuario: IUsuario;
    producto: IProducto;
}