import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUnroutedComponent } from './components/shared/navbar.unrouted/navbar.unrouted.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarUnroutedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'iswart-frontend';
}
