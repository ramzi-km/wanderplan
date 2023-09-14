import { Component, Input } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent {
  @Input() trip: Trip | undefined;
}
