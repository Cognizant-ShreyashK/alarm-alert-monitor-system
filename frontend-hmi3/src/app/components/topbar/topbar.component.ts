import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  template: `
    <div class="topbar">
      <h2>{{ title }}</h2>
    </div>
  `,
  styles: [`
    .topbar { background: #fff; padding: 15px 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px; display: flex; align-items: center; }
    h2 { margin: 0; font-size: 1.4rem; color: #333; }
  `]
})
export class TopbarComponent {
  @Input() title: string = '';
}