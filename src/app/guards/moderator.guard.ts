import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SessionService } from '../service/session.service';
import { IUsuario } from '../model/usuario.interface';
import { UsuarioService } from '../service/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ClientGuard implements CanActivate {

  constructor( 
    private oSessionService: SessionService, 
    private oRouter: Router,
    private oUsuarioService: UsuarioService
) {}

canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    if (this.oSessionService.isSessionActive()) {
        
        let email: string = this.oSessionService.getSessionEmail();
        
        return new Observable<boolean>((observer) => {
            this.oUsuarioService.getbyEmail(email).subscribe({
                next: (data: IUsuario) => {
                    if (data.tipousuario.id === 3) {
                        observer.next(true); // Si es admin, permite el acceso
                    } else {
                        alert('No tienes permiso para acceder a esta sección');
                        this.oRouter.navigate(['/shared/menu']); // Si no es admin, redirige
                        observer.next(false);
                    }
                    observer.complete(); // Completa la emisión
                },
                error: (err) => {
                    console.error('ERROR al obtener el usuario', err);
                    this.oRouter.navigate(['/login']); // Redirige si hay error
                    observer.next(false); // En caso de error, no permite el acceso
                    observer.complete(); // Completa la emisión
                }
            });
        });
    } else {
        // Si la sesión no está activa, redirige al login
        this.oRouter.navigate(['/shared/menu']);
        return of(false); // Impide el acceso
    }
  }
}