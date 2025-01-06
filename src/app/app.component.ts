import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUnroutedComponent } from './components/shared/navbar.unrouted/navbar.unrouted.component';
import { pageTransition } from './animations/animation'; // Importa la animación
import { MenuRoutedComponent } from './components/shared/menu.routed/menu.routed.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarUnroutedComponent, MenuRoutedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `
  <div [@pageTransition]="getOutletState(oRouter)">
    <router-outlet></router-outlet> <!-- El lugar donde se cargan las páginas -->
  </div>
`,
animations: [pageTransition],  // Aplica la animación
})

export class AppComponent {
  title = 'iswart-frontend';

   // Método para obtener el estado del RouterOutlet
   getOutletState(outlet: RouterOutlet) {
    console.log("holi esto es el outlet", outlet);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'] || null;
  }
}
