import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from '../service/session.service';
import { UsuarioService } from '../service/usuario.service';
import { IUsuario } from '../model/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( 
    private oSessionService: SessionService, 
    private oRouter: Router,
    private oUsuarioService: UsuarioService
) {}

canActivate(): Observable<boolean> {
    if (this.oSessionService.isSessionActive()) {
        
        let email: string = this.oSessionService.getSessionEmail();
        
        return new Observable<boolean>((observer) => {
            this.oUsuarioService.getbyEmail(email).subscribe({
                next: (data: IUsuario) => {
                    if (data.tipousuario.id === 1) {
                        observer.next(true); 
                    } else {
                        alert('No tienes permiso para acceder a esta sección');
                        this.oRouter.navigate(['/shared/home']); 
                        observer.next(false);
                    }
                    observer.complete(); 
                },
                error: (err) => {
                    console.error('ERROR al obtener el usuario', err);
                    this.oRouter.navigate(['/login']); 
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    } else {
        this.oRouter.navigate(['/login']);
        return of(false); 
    }
  }
}