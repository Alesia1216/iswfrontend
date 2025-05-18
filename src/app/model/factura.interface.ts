import { DateTime } from "luxon";
import { IUsuario } from "./usuario.interface";

export interface IFactura {
    id?: number;
    fecha: DateTime;
    usuario: IUsuario;
}