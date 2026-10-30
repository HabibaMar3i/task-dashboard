import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Displays the application's primary navigation links. */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  /** Navigation entries displayed in the sidebar. */
  links = [
    { label: 'Dashboard', icon: '📊', link: '/' },
    { label: 'Tasks', icon: '✅' },
    { label: 'Calendar', icon: '📅' },
    { label: 'Analytics', icon: '📈', link: '/analytics' },
    { label: 'Team', icon: '👥', link: '/team' },
    { label: 'Settings', icon: '⚙️' },
  ];
}
