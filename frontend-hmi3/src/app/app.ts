import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Import your Sidebar
import { SidebarComponent } from './components/sidebar/sidebar.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // Added CommonModule to the imports array
  imports: [CommonModule, RouterOutlet, SidebarComponent], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Real-time Fault Monitoring System');
  
  // State variable to control the sidebar visibility
  showSidebar: boolean = true;

  constructor(private router: Router) {
    // Listen to URL changes to dynamically hide the sidebar on the login page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showSidebar = event.urlAfterRedirects !== '/login';
    });
  }
}