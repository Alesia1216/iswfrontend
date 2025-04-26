import { IProducto } from "./producto.interface";
import { IUsuario } from "./usuario.interface";

export interface ICarrito {
    id: number;
    usuario: IUsuario;
    producto: IProducto;
    cantidad: number;
}