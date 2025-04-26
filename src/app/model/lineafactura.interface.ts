import { IFactura } from "./factura.interface";
import { IProducto } from "./producto.interface";

export interface ILineafactura {
    id: number;
    factura: IFactura;
    producto: IProducto;
    unidades: number;
    precio: number;
}