import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // Added ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AlarmService } from '../../services/alarm.service';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TopbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  summaryStats = {
    total: 0,
    active: 0,
    cleared: 0
  };

  private subscription: Subscription = new Subscription();

  // --- 1. DONUT CHART ---
  public donutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'bottom', 
        labels: { 
          color: '#333', 
          usePointStyle: true, 
          padding: 20,
          filter: (legendItem) => legendItem.text !== 'Empty' 
        } 
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.label === 'Empty') return ' No Alarms';
            return ` ${context.label}: ${context.raw}`;
          }
        }
      }
    }
  };
  
  public donutChartLabels: string[] = ['Active', 'Cleared', 'Empty']; 
  public donutChartType: ChartType = 'doughnut';
  public donutChartData: ChartData<'doughnut'> = {
    labels: this.donutChartLabels,
    datasets: [{
      data: [0, 0, 1],
      backgroundColor: ['#f44336', '#4caf50', '#e0e0e0'],
      hoverBackgroundColor: ['#d32f2f', '#388e3c', '#e0e0e0'],
      borderWidth: 0
    }]
  };

  // --- 2. BAR CHART ---
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#333' } },
      y: { grid: { display: true, color: '#e0e0e0' }, ticks: { color: '#333', stepSize: 2 } }
    }
  };
  public barChartLabels: string[] = ['High', 'Medium', 'Low'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [{
      data: [0, 0, 0], 
      backgroundColor: ['#ff5722', '#f44336', '#673ab7'],
      hoverBackgroundColor: ['#e64a19', '#d32f2f', '#512da8'],
      borderWidth: 0,
      barThickness: 40 
    }]
  };

  // Inject ChangeDetectorRef
  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    // 1. Listen to active alarms stream
    this.subscription.add(
      this.alarmService.activeAlarms$.subscribe(alarms => {
        this.summaryStats.active = alarms.length;
        
        // --- THE FIX: Every time active alarms change (polling or ack), 
        // we MUST re-fetch the summary to get the updated cleared count.
        this.fetchSummary(); 
      })
    );

    // 2. Listen to severity breakdown stream
    this.subscription.add(
      this.alarmService.severityBreakdown$.subscribe(breakdown => {
        this.barChartData.datasets[0].data = breakdown;
        this.barChartData = { ...this.barChartData };
        this.cdr.detectChanges(); // Force chart refresh
      })
    );

    // Initial load
    this.alarmService.loadActiveAlarms();
  }

  // Extracted summary fetching logic to be reusable
  private fetchSummary(): void {
    this.alarmService.getAlarmSummary().subscribe({
      next: (summary) => {
        this.summaryStats.cleared = summary.cleared;
        this.updateDonutAndTotal();
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => console.error('Could not fetch summary', err)
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateDonutAndTotal(): void {
    this.summaryStats.total = this.summaryStats.active + this.summaryStats.cleared;

    if (this.summaryStats.total === 0) {
      this.donutChartData.datasets[0].data = [0, 0, 1];
    } else {
      this.donutChartData.datasets[0].data = [this.summaryStats.active, this.summaryStats.cleared, 0];
    }
    
    this.donutChartData = { ...this.donutChartData };
  }
}