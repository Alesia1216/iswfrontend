import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TipousuarioService } from '../../../service/tipousuario.service';
import { ITipousuario } from '../../../model/tipousuario.interface';
import { CryptoService } from '../../../service/crypto.service';

declare let bootstrap: any;

@Component({
  selector: 'app-tipousuario.admin.create.routed',
  templateUrl: './tipousuario.admin.create.routed.component.html',
  styleUrls: ['./tipousuario.admin.create.routed.component.css'],
  standalone: true,
  imports: [RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, CommonModule]
})
export class TipousuarioAdminCreateRoutedComponent implements OnInit {
  id: number = 0;
  oTipousuarioForm: FormGroup | undefined = undefined;
  oTipousuario: ITipousuario | null = null;
  strMessage: string = '';

  myModal: any;

  form: FormGroup = new FormGroup({});

  constructor(
    private oRouter: Router,
    private oTipousuarioService: TipousuarioService,
    private oCryptoService: CryptoService
  ) { }

  ngOnInit() {
    this.createForm();
    this.oTipousuarioForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipousuarioForm = new FormGroup({
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])
    });
  }

  updateForm() {
    this.oTipousuarioForm?.controls['descripcion'].setValue('');
  }


  showModal(mensaje: string) {
    this.strMessage = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  onReset() {
    this.updateForm();
    return false;
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/tipousuario/admin/view/' + this.oTipousuario?.id]);
  }

  onSubmit() {
    if (this.oTipousuarioForm?.invalid) {
      this.showModal('Formulario inválido');
      return;
    } else {
 
      this.oTipousuarioService.create(this.oTipousuarioForm?.value).subscribe({
        next: (oTipousuario: ITipousuario) => {
          this.oTipousuario = oTipousuario;
          this.showModal('Tipo de usuario ' + this.oTipousuario.descripcion + ' creado');
        },
        error: (err: HttpErrorResponse) => {
          this.showModal('Error al crear el tipo de usuario');
          console.log(err);
        },
      });
    }
  }

}