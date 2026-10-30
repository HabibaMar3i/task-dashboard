import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Statistic } from '../../../core/models/statistic.model';

/** Displays a single dashboard statistic. */
@Component({
  selector: 'app-statistic-card',
  templateUrl: './statistic-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  /** Statistic data shown in this card. */
  statistic = input.required<Statistic>();
}
