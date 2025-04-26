import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CompraService } from '../../../../service/compra.service';
import { ICompra } from '../../../../model/compra.interface';
import { HttpErrorResponse } from '@angular/common/http';

declare let bootstrap: any;

@Component({
  selector: 'app-compra.client.delete.routed',
  templateUrl: './compra.client.delete.routed.component.html',
  styleUrls: ['./compra.client.delete.routed.component.css'],
  imports: [RouterModule],
  standalone: true
  
})
export class CompraClientDeleteRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oCompra: ICompra = {} as ICompra;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;

  strMessage: string = '';
  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oCompraService: CompraService,
    private oRouter: Router
  ) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Horas en UTC
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  //TODO - buscar info sobre await sync (da un pequeño error por asincronia al pasar en el html a 
  //to string la fecha ya que aun no le ha llegado el objeto compra)
  getOne() {
    this.oCompraService.get(this.id).subscribe({
      next: (data: ICompra) => {
        this.oCompra = data;
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al recibir el pedido');
      },
    });
  }

  delete(){
    this.oCompraService.delete(this.id).subscribe({
      next: (data) => {
        this.showModal(
          'Su pedido ha sido cancelado'
        );
      },
      error: (err: HttpErrorResponse) => {
        this.showModal('Error al cancelar el pedido');
      },
    });
  }

  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/compra/historial/' + this.oCompra.usuario.id]);
  }

}

