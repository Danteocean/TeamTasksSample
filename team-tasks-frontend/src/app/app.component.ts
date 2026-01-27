import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="nav-brand">
          <h1>Team Tasks Manager</h1>
        </div>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
          <a routerLink="/new-task" routerLinkActive="active" class="nav-link">Nueva Tarea</a>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>&copy; 2026 Team Tasks Manager. Angular Frontend.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
    }

    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h1 {
      color: #007bff;
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: #495057;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #007bff;
    }

    .nav-link.active {
      background: #007bff;
      color: white;
    }

    .main-content {
      flex: 1;
      padding: 0;
    }

    .footer {
      background: #343a40;
      color: white;
      text-align: center;
      padding: 1rem;
      margin-top: auto;
    }

    .footer p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .nav-link {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class AppComponent {
  constructor(private router: Router) {}
}