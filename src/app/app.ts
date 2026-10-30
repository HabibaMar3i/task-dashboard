import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TaskService } from './core/services/task.service';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

/** Root component that renders the application shell. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Application title. */
  protected readonly title = signal('task-dashboard');

  private taskService = inject(TaskService);

  /** Loads tasks when the root component is created. */
  constructor() {
    this.taskService.getAllTasks().subscribe(console.log);
  }
}
