import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';

import { TopbarComponent } from '../topbar/topbar.component'; 
import { AlarmService } from '../../services/alarm.service';
import { Alarm } from '../../models/alarm.model';

@Component({
  selector: 'app-active-alarms',
  standalone: true,
  imports: [CommonModule, FormsModule, TopbarComponent],
  templateUrl: './active-alarms.component.html',
  styleUrls: ['./active-alarms.component.css']
})
export class ActiveAlarmsComponent implements OnInit, OnDestroy {
  allAlarms: Alarm[] = [];
  filteredAlarms: Alarm[] = [];
  private subscription: Subscription = new Subscription();

  searchTerm: string = '';
  severityFilter: string = 'All';
  sortBy: string = 'recent';

  raisedCount: number = 0;
  acknowledgedCount: number = 0;

  showModal: boolean = false;
  modalType: 'single' | 'all' = 'single';
  selectedAlarm: Alarm | null = null;

  private severityWeight: { [key: string]: number } = {
    'High': 3,
    'Medium': 2,
    'Low': 1
  };

  // Inject ChangeDetectorRef
  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // Subscribe to the LIVE stream from the service
    this.subscription.add(
      this.alarmService.activeAlarms$.subscribe((alarms: Alarm[]) => {
        this.allAlarms = alarms;
        this.raisedCount = alarms.length; 
        this.filterAndSortAlarms();
        
        // FORCE UI REFRESH: This tells Angular that new data arrived from the polling timer
        this.cdr.detectChanges(); 
      })
    );

    // Initial fetch for the summary counts
    this.alarmService.getAlarmSummary().subscribe((summary: {active: number, cleared: number}) => {
       this.acknowledgedCount = summary.cleared;
       this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); 
  }

  filterAndSortAlarms(): void {
    let result = [...this.allAlarms];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(a => 
        a.message.toLowerCase().includes(term) || 
        a.code.toLowerCase().includes(term)
      );
    }

    if (this.severityFilter !== 'All') {
      result = result.filter(a => a.severity === this.severityFilter);
    }

    result.sort((a, b) => {
      if (this.sortBy === 'severity') {
        return (this.severityWeight[b.severity] || 0) - (this.severityWeight[a.severity] || 0);
      } else {
        return b.id - a.id; 
      }
    });

    this.filteredAlarms = result;
    this.cdr.detectChanges(); // Ensure filtered results show up instantly
  }

  getSeverityCount(severity: string): number {
    return this.allAlarms.filter(a => a.severity === severity).length;
  }

  trackById(index: number, alarm: Alarm): number {
    return alarm.id; 
  }

  openSingleModal(alarm: Alarm): void {
    this.selectedAlarm = alarm;
    this.modalType = 'single';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openAllModal(): void {
    this.modalType = 'all';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedAlarm = null;
    this.cdr.detectChanges();
  }

  confirmAction(): void {
    if (this.modalType === 'single' && this.selectedAlarm) {
      this.alarmService.acknowledgeAlarm(this.selectedAlarm.id).subscribe({
        next: () => {
          this.acknowledgedCount++;
          // We don't necessarily need to call loadActiveAlarms() because 
          // the Service is already polling every 5 seconds.
          // But closing the modal and forcing a check makes it feel instant.
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error acknowledging alarm:', err)
      });
    } else if (this.modalType === 'all') {
      const requests = this.filteredAlarms.map(alarm => this.alarmService.acknowledgeAlarm(alarm.id));
      forkJoin(requests).subscribe({
        next: () => {
          this.acknowledgedCount += this.filteredAlarms.length;
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error acknowledging all alarms:', err)
      });
    }
  }
}