import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TasksStore } from '../../core/stores/tasks.store';

/** Displays team members from the shared tasks store. */
@Component({
  selector: 'app-team-page',
  imports: [MessageModule, ProgressSpinnerModule],
  templateUrl: './team.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPage implements OnInit {
  /** Shared store containing the team member list. */
  store = inject(TasksStore);

  /** Loads team members when the page is initialized. */
  ngOnInit() {
    this.store.loadUsers();
  }
}
