import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';

/** Displays the application header and task search field. */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class NavbarComponent {
  /** Shared task store used to update the search filter. */
  store = inject(TasksStore);

  /** Updates the task search filter from the search input. */
  onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }
}
