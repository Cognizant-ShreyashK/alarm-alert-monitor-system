import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  
  setTheme(theme: string) {
    // Check if we are in the browser (prevents SSR errors)
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      // Save choice to local storage
      localStorage.setItem('hmi-theme', theme);
    }
  }

  loadSavedTheme(): string {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('hmi-theme') || 'light';
      this.setTheme(savedTheme);
      return savedTheme;
    }
    return 'light';
  }
}