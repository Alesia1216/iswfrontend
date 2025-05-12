import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ICarrito } from '../../../../model/carrito.interface';
import { CarritoService } from '../../../../service/carrito.service';

@Component({
  selector: 'app-carrito.admin.view.routed',
  templateUrl: './carrito.admin.view.routed.component.html',
  styleUrls: ['./carrito.admin.view.routed.component.css'],
  imports: [RouterModule, RouterLink],
  standalone: true
})
export class CarritoAdminViewRoutedComponent implements OnInit {

    id: number = 0;
    route: string = '';
    oCarrito: ICarrito = {} as ICarrito;
  
  constructor(
    private oActivatedRoute: ActivatedRoute, 
    private oCarritoService: CarritoService
  ) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }

  getOne(){
    this.oCarritoService.get(this.id).subscribe({
      next: (data: ICarrito) => {
        this.oCarrito = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
