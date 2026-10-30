import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Displays the application's primary navigation links. */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** Navigation entries displayed in the sidebar. */
  links = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'Tasks', icon: '✅', active: false },
    { label: 'Calendar', icon: '📅', active: false },
    { label: 'Analytics', icon: '📈', active: false },
    { label: 'Team', icon: '👥', active: false },
    { label: 'Settings', icon: '⚙️', active: false },
  ];
}
