import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TasksStore } from '../../core/stores/tasks.store';
import { httpResource } from '@angular/common/http';
import { Activity } from '../../core/models/activity.model';
import { ActivityFeedComponent } from './activity-feed/activity-feed.component';

/** Displays task analytics charts and recent activity. */
@Component({
  selector: 'app-analytics-page',
  imports: [ChartModule, ActivityFeedComponent, MessageModule, ProgressSpinnerModule],
  templateUrl: './analytics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPage implements OnInit {
  /** Shared task data and loading actions. */
  store = inject(TasksStore);

  /** Recent activity returned by the activity API. */
  activities = httpResource<Activity[]>(() => '/api/activities');

  /** Options shared by the analytics charts. */
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  /** Task counts grouped by workflow status. */
  statusChart = computed(() => {
    const tasks = this.store.tasks();
    return {
      labels: ['To Do', 'In Progress', 'Done'],
      datasets: [
        {
          data: [
            tasks.filter((t) => t.status === 'todo').length,
            tasks.filter((t) => t.status === 'in_progress').length,
            tasks.filter((t) => t.status === 'done').length,
          ],
          backgroundColor: ['#94a3b8', '#3b82f6', '#22c55e'],
        },
      ],
    };
  });

  /** Task counts grouped by priority. */
  priorityChart = computed(() => {
    const tasks = this.store.tasks();
    return {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          data: [
            tasks.filter((t) => t.priority === 'high').length,
            tasks.filter((t) => t.priority === 'medium').length,
            tasks.filter((t) => t.priority === 'low').length,
          ],
          backgroundColor: ['#ef4444', '#f59e0b', '#22c55e'],
        },
      ],
    };
  });

  /** Loads task data when the analytics page is initialized. */
  ngOnInit() {
    this.store.loadTasks();
  }
}
