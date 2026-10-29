import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('task-dashboard');
  private taskService = inject(TaskService);
  constructor() {
    this.taskService.getAllTasks().subscribe(console.log);
  }
}
