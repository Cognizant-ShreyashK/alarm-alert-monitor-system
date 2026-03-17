import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
// 1. Import the charting providers
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch()), // Add this line to enable backend API calls!
    // 2. Add the charting provider here to globally register Chart.js
    provideCharts(withDefaultRegisterables()) 
  ]
};