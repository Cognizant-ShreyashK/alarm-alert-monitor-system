import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopbarComponent } from '../topbar/topbar.component'; 
import { AlarmService } from '../../services/alarm.service';
import { ThemeService } from '../../services/theme.service'; // 1. Import Theme Service

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  autoRefreshInterval: string = '5';
  themeMode: string = 'light'; 
  criticalAlarmsAlert: boolean = true;
  soundAlerts: boolean = true;

  // 2. Inject ThemeService
  constructor(private alarmService: AlarmService, private themeService: ThemeService) {}

  ngOnInit(): void {
    // 3. Load the saved theme when the page opens so the dropdown matches reality
    this.themeMode = this.themeService.loadSavedTheme();
  }

  // 4. Trigger this directly from the HTML dropdown
  onThemeChange(): void {
    this.themeService.setTheme(this.themeMode);
  }

  saveSettings(): void {
    const intervalInSeconds = parseInt(this.autoRefreshInterval, 10);
    this.alarmService.setRefreshInterval(intervalInSeconds);
    alert('Settings saved successfully!');
  }
}