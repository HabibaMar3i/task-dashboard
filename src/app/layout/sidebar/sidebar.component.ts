import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Displays the application's primary navigation links. */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** Navigation entries displayed in the sidebar. */
  links = [
    { label: 'Dashboard', icon: '📊', active: true, link: '/' },
    { label: 'Tasks', icon: '✅', active: false },
    { label: 'Calendar', icon: '📅', active: false },
    { label: 'Analytics', icon: '📈', active: false, link: '/analytics' },
    { label: 'Team', icon: '👥', active: false, link: '/team' },
    { label: 'Settings', icon: '⚙️', active: false },
  ];
}
