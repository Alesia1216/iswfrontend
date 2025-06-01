import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUnroutedComponent } from './components/shared/navbar.unrouted/navbar.unrouted.component';
import { pageTransition } from './animations/animation';
import { FooterUnroutedComponent } from "./components/shared/footer.unrouted/footer.unrouted.component"; // Importa la animación


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavbarUnroutedComponent, FooterUnroutedComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    template: `
  <div [@pageTransition]="getOutletState(oRouter)">
    <router-outlet></router-outlet> <!-- El lugar donde se cargan las páginas -->
  </div>
`,
    animations: [pageTransition]
})

export class AppComponent {
  title = 'iswart-frontend';

   // Método para obtener el estado del RouterOutlet
   getOutletState(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'] || null;
  }
}
