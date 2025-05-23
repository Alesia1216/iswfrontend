import { ITipousuario } from "./tipousuario.interface";

export interface IUsuario {
    id: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    email: string;
    password: string;
    telefono: string;
    direccion: string;
    tipousuario: ITipousuario;
}