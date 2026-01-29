import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="app-container">
      
      <!-- Loading overlay -->
      <div
        class="loading-overlay"
        *ngIf="dataService.loading && !dataService.initialized"
      >
        <div class="loading-spinner"></div>
        <p>Cargando datos iniciales...</p>
      </div>

      <!-- Error message -->
      <div class="error-message" *ngIf="dataService.error">
        <p>{{ dataService.error }}</p>
        <button class="btn btn-primary" (click)="retryLoad()">Reintentar</button>
      </div>

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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h1 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      text-decoration: none;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      transition: all 0.3s;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      transform: translateY(-1px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
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

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #f8d7da;
      color: #721c24;
      padding: 1rem 2rem;
      border-radius: 8px;
      border: 1px solid #f5c6cb;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      text-align: center;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
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
export class AppComponent implements OnInit {
  
  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    console.log('🎯 AppComponent ngOnInit() called');
    // Cargar datos iniciales al arrancar
    this.dataService.loadInitialData();
  }

  retryLoad(): void {
    console.log('🔄 AppComponent.retryLoad() called');
    this.dataService.clearCache();
    this.dataService.loadInitialData();
  }
}