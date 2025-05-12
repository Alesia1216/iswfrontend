import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ICarrito } from '../../../../model/carrito.interface';
import { CarritoService } from '../../../../service/carrito.service';

@Component({
  selector: 'app-carrito.client.view.routed',
  templateUrl: './carrito.client.view.routed.component.html',
  styleUrls: ['./carrito.client.view.routed.component.css'],
  imports: [RouterModule, RouterLink],
  standalone: true
})
export class CarritoClientViewRoutedComponent implements OnInit {

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
