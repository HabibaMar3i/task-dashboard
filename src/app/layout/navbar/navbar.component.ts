import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TasksStore } from '../../core/stores/tasks.store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class NavbarComponent {
  store = inject(TasksStore);

  onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }
}
