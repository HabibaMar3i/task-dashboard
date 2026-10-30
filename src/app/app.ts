import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NavbarComponent } from './layout/navbar/navbar.component';

/** Root component that renders the application shell. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
