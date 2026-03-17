import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { Alarm } from '../models/alarm.model';

@Injectable({
  providedIn: 'root'
})
export class AlarmService implements OnDestroy {
  private baseUrl = 'http://127.0.0.1:8085/api';

  private activeAlarmsSubject = new BehaviorSubject<Alarm[]>([]);
  public activeAlarms$ = this.activeAlarmsSubject.asObservable();

  // Keep track of the active timer so we can cancel it
  private pollingSubscription?: Subscription;

  constructor(private http: HttpClient) {
    // Start polling automatically at 5 seconds when the app loads
    this.setRefreshInterval(5);
  }

  // --- NEW: DYNAMIC POLLING ENGINE ---
  setRefreshInterval(seconds: number): void {
    // 1. Cancel the old timer if it exists
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    // 2. Create a new timer that fires immediately (0ms), then every X seconds
    this.pollingSubscription = timer(0, seconds * 1000).pipe(
      // switchMap automatically switches to the inner HTTP observable
      switchMap(() => this.http.get<Alarm[]>(`${this.baseUrl}/Alarm/active`))
    ).subscribe({
      next: (alarms) => this.activeAlarmsSubject.next(alarms),
      error: (err) => console.error('Polling failed', err)
    });
  }

  // Manual override (Optional: good for a "Refresh Now" button)
  loadActiveAlarms(): void {
    this.http.get<Alarm[]>(`${this.baseUrl}/Alarm/active`).subscribe({
      next: (alarms) => this.activeAlarmsSubject.next(alarms),
      error: (err) => console.error('Manual fetch failed', err)
    });
  }

  acknowledgeAlarm(id: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/Alarm/acknowledge/${id}`, {}).pipe(
    tap(() => {
      // 1. Get the current list of alarms from the Subject
      const currentAlarms = this.activeAlarmsSubject.getValue();
      
      // 2. Remove the acknowledged alarm locally
      const updatedAlarms = currentAlarms.filter(a => a.id !== id);
      
      // 3. Push the new list back into the Subject
      // This automatically updates the UI on every page listening to this Service!
      this.activeAlarmsSubject.next(updatedAlarms);
    })
  );
}

  getAlarmSummary(): Observable<{active: number, cleared: number}> {
    return this.http.get<{active: number, cleared: number}>(`${this.baseUrl}/Alarm/summary`);
  }

  // Fetch the historical log of cleared alarms
  getAlarmHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Alarm/history`); 
  }

  // ==========================================
  // NEW: MISSING METHOD ADDED HERE
  // ==========================================
 // NEW: Delete all history
  // clearAlarmHistory(): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/Alarm/history/clear`, { responseType: 'text' });
  // }

  clearAlarmHistory(): Observable<any> {
    // Standard delete call (Angular will automatically parse the new {"message": "success"} JSON)
    return this.http.delete(`${this.baseUrl}/Alarm/history/clear`);
  }

  public severityBreakdown$: Observable<number[]> = this.activeAlarms$.pipe(
    map(alarms => [
      alarms.filter(a => a.severity === 'High').length,
      alarms.filter(a => a.severity === 'Medium').length,
      alarms.filter(a => a.severity === 'Low').length
    ])
  );

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
}