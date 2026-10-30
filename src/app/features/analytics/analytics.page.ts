import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TasksStore } from '../../core/stores/tasks.store';

@Component({
  selector: 'app-analytics-page',
  imports: [ChartModule],
  templateUrl: './analytics.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPage implements OnInit {
  store = inject(TasksStore);

  chartOptions = { plugins: { legend: { position: 'bottom' } } };

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

  ngOnInit() {
    this.store.loadTasks();
  }
}
