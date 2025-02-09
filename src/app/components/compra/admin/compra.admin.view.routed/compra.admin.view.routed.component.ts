import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { CompraService } from '../../../../service/compra.service';
import { ICompra } from '../../../../model/compra.interface';

@Component({
  selector: 'app-compra.admin.view.routed',
  templateUrl: './compra.admin.view.routed.component.html',
  styleUrls: ['./compra.admin.view.routed.component.css'],
  imports: [RouterModule, RouterLink]
  
})
export class CompraAdminViewRoutedComponent implements OnInit {

  id: number = 0;
  route: string = '';
  oCompra: ICompra = {} as ICompra;
  numeroApuntes: number = 0;
  numeroApuntesAbiertos: number = 0;

  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oCompraService: CompraService
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

  getOne() {
    this.oCompraService.get(this.id).subscribe({
      next: (data: ICompra) => {
        this.oCompra = data;
      },
    });
  }
}

