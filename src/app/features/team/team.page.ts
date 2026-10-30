import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';

@Component({
  selector: 'app-team-page',
  templateUrl: './team.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPage implements OnInit {
  store = inject(TasksStore);

  ngOnInit() {
    this.store.loadUsers();
  }
}
