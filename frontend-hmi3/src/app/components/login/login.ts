import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html', // Fixed to match Angular CLI naming
  styleUrls: ['./login.css']   // Fixed to match Angular CLI naming
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private router: Router) {}

  onLogin(): void {
    this.errorMessage = ''; // Reset error on new attempt
    this.isLoading = true;

    // Simulate a quick network delay for realism
    setTimeout(() => {
      if (this.username === 'admin' && this.password === 'password') {
        // Active Navigation: This instantly routes the user to the dashboard
        this.router.navigate(['/active-alarms']); 
      } else {
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
      this.isLoading = false;
    }, 800); 
  }
}