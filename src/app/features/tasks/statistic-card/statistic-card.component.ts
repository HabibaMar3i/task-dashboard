import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Statistic } from '../../../core/models/statistic.model';

@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  statistic = input.required<Statistic>();
}
