import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ModalTipo = 'info' | 'confirmacion' | 'cantidad';

@Component({
  selector: 'app-modal-generico',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ModalGenericoComponent {
  
  @Input() tipo: ModalTipo = 'info';
  @Input() titulo: string = '';
  @Input() mensaje: string = '';
  @Input() cantidadInicial: number = 1;
  @Input() cantidadMinima: number = 1;
  @Input() cantidadMaxima: number = 100;

  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  cantidadSeleccionada: number = this.cantidadInicial;

  ngOnInit() {
    this.cantidadSeleccionada = this.cantidadInicial;
  }

  onConfirmar() {
    if (this.tipo === 'cantidad') {
      this.confirmar.emit(this.cantidadSeleccionada);
    } else {
      this.confirmar.emit(true);
    }
  }

  onCancelar() {
    this.cerrar.emit();
  }
}
