import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TopbarComponent } from '../topbar/topbar.component'; 
import { AlarmService } from '../../services/alarm.service';

export interface HistoricalAlarm {
  code: string;
  message: string;
  severity: string;
  status: string;
  clearedAt: string;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  severityFilter: string = 'All';

  allClearedAlarms: HistoricalAlarm[] = [];
  filteredAlarms: HistoricalAlarm[] = [];
  
  showClearModal: boolean = false;
  isClearing: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef // Injected for manual UI updates
  ) {}

  ngOnInit(): void {
    // --- THE FIX: Reactive Subscription ---
    // Every time an alarm is acknowledged or the polling timer runs, 
    // we fetch the history again so it stays updated in real-time.
    this.subscription.add(
      this.alarmService.activeAlarms$.subscribe(() => {
        this.fetchHistory();
      })
    );

    // Initial fetch when first landing on the page
    this.fetchHistory();
  }

  // Extracted fetch logic into its own method for reuse
  fetchHistory(): void {
    this.alarmService.getAlarmHistory().subscribe({
      next: (historyData: HistoricalAlarm[]) => {
        this.allClearedAlarms = historyData;
        this.filterAlarms();
        // Force Angular to redraw the table with new data
        this.cdr.detectChanges(); 
      },
      error: (err: any) => console.error('Failed to fetch alarm history from backend', err)
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  filterAlarms(): void {
    let result = this.allClearedAlarms;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a => 
        (a.message && a.message.toLowerCase().includes(term)) || 
        (a.code && a.code.toLowerCase().includes(term))
      );
    }

    if (this.severityFilter !== 'All') {
      result = result.filter(a => 
        a.severity && a.severity.toUpperCase() === this.severityFilter.toUpperCase()
      );
    }

    this.filteredAlarms = result;
    this.cdr.detectChanges(); // Update filtered view instantly
  }

  openClearModal(): void {
    this.showClearModal = true;
    this.cdr.detectChanges();
  }

  closeClearModal(): void {
    this.showClearModal = false;
    this.cdr.detectChanges();
  }

  confirmClearHistory(): void {
    this.isClearing = true;
    this.cdr.detectChanges();

    this.subscription.add(
      this.alarmService.clearAlarmHistory().subscribe({
        next: () => {
          this.allClearedAlarms = [];
          this.filteredAlarms = [];
          this.isClearing = false;
          this.showClearModal = false;
          this.cdr.detectChanges(); // UI wiped instantly
        },
        error: (err: any) => {
          this.isClearing = false;
          this.showClearModal = false;
          this.cdr.detectChanges();
        }
      })
    );
  }
}