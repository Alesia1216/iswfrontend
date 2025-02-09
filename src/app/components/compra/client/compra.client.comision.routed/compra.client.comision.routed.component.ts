import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-compra.client.comision.routed',
  templateUrl: './compra.client.comision.routed.component.html',
  styleUrls: ['./compra.client.comision.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class CompraClientComisionRoutedComponent implements OnInit {
  form: FormGroup;
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario reactivo
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(5)]], // Descripción obligatoria
      image: [null], // Imagen opcional
    });
  }

  ngOnInit(): void {}

  // Método para manejar la selección de la imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.form.patchValue({
        image: this.selectedImage,
      });
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  // Método para enviar el formulario
  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();
      formData.append('description', this.form.get('description')?.value);
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      // enviar los datos al servidor

      //crear nueva clase???

      console.log('Formulario enviado', formData);
    } else {
      console.log('El formulario no es válido');
    }
  }
}