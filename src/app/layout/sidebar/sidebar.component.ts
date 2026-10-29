import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  links = [
    { label: 'Dashboard', icon: '▦', active: true },
    { label: 'Tasks', icon: '☑', active: false },
    { label: 'Calendar', icon: '📅', active: false },
    { label: 'Analytics', icon: '📊', active: false },
    { label: 'Team', icon: '👥', active: false },
    { label: 'Settings', icon: '⚙', active: false },
  ];
}
