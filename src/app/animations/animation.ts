
import { trigger, transition, style, animate } from '@angular/animations';

export const pageTransition = trigger('pageTransition', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('500ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

