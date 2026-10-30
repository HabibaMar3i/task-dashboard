import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Activity } from '../../../core/models/activity.model';

@Component({
  selector: 'app-activity-feed',
  imports: [DatePipe],
  templateUrl: './activity-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent {
  activities = input.required<Activity[]>();
}
