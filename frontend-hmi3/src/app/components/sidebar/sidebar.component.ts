import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; 
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule], 
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      
      <div class="sidebar-header">
        <div class="brand-container" *ngIf="!isCollapsed">
          <div class="accent-line"></div>
          <div class="brand-text">
            <h2>Real Time Alert</h2>
            <span>Monitor system</span>
          </div>
        </div>
        
        <button class="toggle-btn" (click)="toggleSidebar()">
          <i class="fas" [class.fa-bars]="isCollapsed" [class.fa-chevron-left]="!isCollapsed"></i>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="nav-label" *ngIf="!isCollapsed">MAIN MENU</div>
        <ul>
          <li routerLink="/dashboard" routerLinkActive="active" [title]="isCollapsed ? 'Dashboard' : ''">
            <i class="fas fa-th-large"></i> 
            <span class="nav-text" *ngIf="!isCollapsed">Dashboard</span>
          </li>
          <li routerLink="/active-alarms" routerLinkActive="active" [title]="isCollapsed ? 'Active Alarms' : ''">
            <i class="fas fa-exclamation-triangle"></i> 
            <span class="nav-text" *ngIf="!isCollapsed">Active Alarms</span>
          </li>
          <li routerLink="/history" routerLinkActive="active" [title]="isCollapsed ? 'History' : ''">
            <i class="fas fa-history"></i> 
            <span class="nav-text" *ngIf="!isCollapsed">History</span>
          </li>
          <li routerLink="/settings" routerLinkActive="active" [title]="isCollapsed ? 'Settings' : ''">
            <i class="fas fa-sliders-h"></i> 
            <span class="nav-text" *ngIf="!isCollapsed">Settings</span>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div class="system-status">
          <div class="status-indicator"></div>
          <div class="status-text" *ngIf="!isCollapsed">
            <strong>SYSTEM ONLINE</strong>
            <span class="live-clock">{{ currentTime | date:'HH:mm:ss' }}</span>
          </div>
        </div>

        <button class="btn-logout" (click)="logout()" [title]="isCollapsed ? 'Logout' : ''">
          <i class="fas fa-power-off"></i> 
          <span *ngIf="!isCollapsed">Disconnect Session</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Deep Onyx Layout with Smooth Width Transition */
    .sidebar { 
      display: flex; 
      flex-direction: column; 
      width: 250px; 
      background-color: #0a0a0a; 
      color: #a3a3a3; 
      min-height: 100vh;
      border-right: 1px solid #262626;
      font-family: 'Inter', sans-serif;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smooth snap effect */
      overflow-x: hidden; /* Prevents text from spilling out while shrinking */
    }
    
    /* Collapsed State Override */
    .sidebar.collapsed {
      width: 80px;
    }

    /* Minimalist Header */
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between; 
      padding: 32px 16px; /* Reduced from 24px to give the button more breathing room */
      height: 100px; 
    }
    .sidebar.collapsed .sidebar-header {
      justify-content: center; 
      padding: 32px 0;
    }

    .brand-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .accent-line {
      width: 4px;
      height: 36px;
      background-color: #06b6d4; 
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
      border-radius: 2px;
    }
    .brand-text { display: flex; flex-direction: column; white-space: nowrap; }
    .brand-text h2 { margin: 0; font-size: 1.15rem; font-weight: 600; color: #ffffff; letter-spacing: 0.5px; }
    .brand-text span { font-size: 0.7rem; color: #06b6d4; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: 500;}

    /* Toggle Button */
    .toggle-btn {
      background: rgba(6, 182, 212, 0.1); /* Subtle cyan background so it stands out */
      border: 1px solid rgba(6, 182, 212, 0.3); /* Light border */
      color: #06b6d4; /* Bright cyan icon */
      font-size: 1.1rem;
      cursor: pointer;
      width: 36px;  /* Fixed width */
      height: 36px; /* Fixed height */
      flex-shrink: 0; /* CRITICAL: Prevents the text from pushing it off the screen */
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .toggle-btn:hover {
      background: #06b6d4;
      color: #0a0a0a; /* Reverses color on hover for a satisfying click effect */
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
    }

    /* Navigation Label */
    .nav-label {
      font-size: 0.65rem;
      color: #525252;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 10px 0 10px 32px;
      font-weight: 700;
      white-space: nowrap;
    }

    .sidebar-content { flex: 1; padding: 10px 0; }
    
    /* Navigation Items */
    ul { list-style: none; padding: 0; margin: 0; }
    li { 
      display: flex;
      align-items: center;
      padding: 16px 32px; 
      cursor: pointer; 
      color: #a3a3a3;
      border-left: 3px solid transparent; 
      transition: all 0.2s ease; 
      white-space: nowrap;
    }
    /* Center icons perfectly when collapsed */
    .sidebar.collapsed li {
      justify-content: center;
      padding: 16px 0;
    }

    li i { width: 28px; font-size: 1.1rem; text-align: center; }
    /* Space out text when expanded */
    .sidebar:not(.collapsed) li i { margin-right: 16px; text-align: left; }

    .nav-text { font-size: 0.95rem; font-weight: 500; letter-spacing: 0.3px; }
    
    /* Hover and Active States */
    li:hover { 
      color: #ffffff;
      background-color: #171717;
    }
    li.active { 
      background: linear-gradient(90deg, rgba(6, 182, 212, 0.1) 0%, rgba(10, 10, 10, 0) 100%);
      color: #ffffff; 
      border-left: 3px solid #06b6d4; 
    }
    li.active i { color: #06b6d4; } 

    /* Footer */
    .sidebar-footer { padding: 32px 24px; border-top: 1px solid #262626; white-space: nowrap; }
    .sidebar.collapsed .sidebar-footer { padding: 32px 0; display: flex; flex-direction: column; align-items: center; }
    
    .system-status { 
      display: flex; 
      align-items: center; 
      gap: 16px; 
      margin-bottom: 24px; 
    }
    .sidebar.collapsed .system-status { gap: 0; }
    
    /* Glowing Status Dot */
    .status-indicator {
      width: 10px;
      height: 10px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
      animation: breathe 2.5s infinite ease-in-out;
    }
    @keyframes breathe {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .status-text { display: flex; flex-direction: column; gap: 4px; }
    .status-text strong { font-size: 0.75rem; letter-spacing: 1.5px; color: #737373; font-weight: 700; }
    .live-clock { color: #ffffff; font-size: 1.1rem; font-family: monospace; letter-spacing: 2px; }
    
    /* Ghost Logout Button */
    .btn-logout { 
      width: 100%; 
      background: transparent; 
      color: #737373; 
      border: none;
      padding: 12px 0; 
      font-size: 0.9rem; 
      font-weight: 500; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      transition: color 0.2s ease; 
    }
    .sidebar.collapsed .btn-logout { padding: 0; justify-content: center; width: auto; }
    .sidebar.collapsed .btn-logout i { margin-right: 0; }
    .btn-logout:hover { color: #ef4444; } 
    .sidebar:not(.collapsed) .btn-logout i { margin-right: 12px; font-size: 1.1rem; }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Navigation State
  isCollapsed: boolean = false;

  // Clock State
  currentTime: Date = new Date();
  private timerId: any;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.detectChanges(); 
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  // Toggle the sidebar open/closed
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}