import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DeveloperWorkload, ProjectHealth, DeveloperDelayRisk } from '../../models/api.models';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableComponent],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <button class="btn btn-primary" (click)="openNewTaskModal()">New Task</button>
      </header>

      <div class="dashboard-grid">
        <!-- Carga por desarrollador -->
        <section class="dashboard-section">
          <h2>Carga por Desarrollador</h2>
          <app-table
            [columns]="workloadColumns"
            [data]="developerWorkload"
            (sort)="onWorkloadSort($event)"
          ></app-table>
        </section>

        <!-- Estado por proyecto -->
        <section class="dashboard-section">
          <h2>Estado por Proyecto</h2>
          <app-table
            [columns]="projectColumns"
            [data]="projectHealth"
            [highlightCondition]="highlightOpenTasks"
          ></app-table>
        </section>

        <!-- Riesgo de retraso -->
        <section class="dashboard-section">
          <h2>Riesgo de Retraso por Desarrollador</h2>
          <app-table
            [columns]="riskColumns"
            [data]="delayRisk"
            [highlightCondition]="highlightHighRisk"
            (rowClick)="showRiskDetails($event)"
          ></app-table>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #dee2e6;
    }

    .dashboard-header h1 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .dashboard-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dashboard-section h2 {
      color: #495057;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      border-left: 4px solid #007bff;
      padding-left: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .dashboard-section {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  developerWorkload: DeveloperWorkload[] = [];
  projectHealth: ProjectHealth[] = [];
  delayRisk: DeveloperDelayRisk[] = [];

  workloadColumns = [
    { key: 'developer', header: 'Desarrollador', sortable: true },
    { key: 'openTasksCount', header: 'Tareas Abiertas', sortable: true },
    { key: 'totalEstimatedComplexity', header: 'Complejidad Total', sortable: true }
  ];

  projectColumns = [
    { key: 'project', header: 'Proyecto', sortable: true },
    { key: 'client', header: 'Cliente', sortable: true },
    { key: 'totalTasks', header: 'Total Tareas', sortable: true },
    { key: 'openTasks', header: 'Abiertas', sortable: true },
    { key: 'completedTasks', header: 'Completadas', sortable: true }
  ];

  riskColumns = [
    { key: 'developerName', header: 'Desarrollador', sortable: true },
    { key: 'openTasksCount', header: 'Tareas Abiertas', sortable: true },
    { key: 'avgDelayDays', header: 'Promedio Retraso (días)', sortable: true },
    { key: 'nearestDueDate', header: 'Fecha Más Cercana', sortable: true },
    { key: 'latestDueDate', header: 'Fecha Más Lejana', sortable: true },
    { key: 'highRiskFlag', header: 'Alto Riesgo', sortable: true }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.apiService.getDeveloperWorkload().subscribe({
      next: (response: any) => {
        this.developerWorkload = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading developer workload:', error);
      }
    });

    this.apiService.getProjectHealth().subscribe({
      next: (response: any) => {
        this.projectHealth = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading project health:', error);
      }
    });

    this.apiService.getDeveloperDelayRisk().subscribe({
      next: (response: any) => {
        this.delayRisk = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading delay risk:', error);
      }
    });
  }

  onWorkloadSort(event: { key: string; order: 'asc' | 'desc' }): void {
    this.developerWorkload.sort((a, b) => {
      const aValue = a[event.key as keyof DeveloperWorkload];
      const bValue = b[event.key as keyof DeveloperWorkload];
      
      if (aValue < bValue) return event.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return event.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  highlightOpenTasks = (project: ProjectHealth): boolean => {
    return project.openTasks > project.completedTasks;
  };

  highlightHighRisk = (risk: DeveloperDelayRisk): boolean => {
    return risk.highRiskFlag;
  };

  showRiskDetails(risk: DeveloperDelayRisk): void {
    console.log('Risk details:', risk);
  }

  openNewTaskModal(): void {
    console.log('Open new task modal');
  }
}