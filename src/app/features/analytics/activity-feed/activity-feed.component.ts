import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Activity } from '../../../core/models/activity.model';

/** Displays a list of recent task activity entries. */
@Component({
  selector: 'app-activity-feed',
  imports: [DatePipe],
  templateUrl: './activity-feed.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent {
  /** Activity entries to display in the feed. */
  activities = input.required<Activity[]>();
}
