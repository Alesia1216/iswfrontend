export interface IProducto {
    id: number;
    descripcion: string;
    estilo: string;
    unidades: number;
    precio: number;
    habilitado: boolean;
    imagen: Blob;
}

export interface ProductoDTO{
  id: number;
  descripcion: string;
  estilo: string;
  unidades: number;
  precio: number;
  habilitado: boolean;
  imagenBase64: string;
}