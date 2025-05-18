import { IFactura } from "./factura.interface";
import { IProducto } from "./producto.interface";

export interface ILineafactura {
    id?: number;
    factura: IFactura;
    producto: IProducto;
    cantidad: number;
    precio: number;
}