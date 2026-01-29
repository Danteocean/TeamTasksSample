import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DeveloperWorkload, ProjectHealth, DeveloperDelayRisk, Project } from '../../models/api.models';
import { TableComponent } from '../table/table.component';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
   <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <button class="btn btn-primary" (click)="goToNewTask()">Nueva Tarea</button>
      </header>

      <div class="dashboard-grid">
        <section class="dashboard-section">
          <h2>Carga por Desarrollador</h2>
          <app-table
            [columns]="workloadColumns"
            [data]="developerWorkload"
            (sort)="onWorkloadSort($event)"
          ></app-table>
        </section>

        <section class="dashboard-section">
          <h2>Estado por Proyecto</h2>
          <div class="project-selector">
            <label for="project-select">Seleccionar Proyecto:</label>
            <select 
              id="project-select" 
              [(ngModel)]="selectedProjectId" 
              (ngModelChange)="onProjectChange($event)" 
              class="form-control">
              <option [ngValue]="null">Todos los proyectos</option>
              @for (project of availableProjects; track project.projectId) {
                <option [ngValue]="project.projectId">
                  {{ project.name }} ({{ project.clientName }})
                </option>
              }
            </select>
          </div>
          <app-table
            [columns]="projectColumns"
            [data]="projectHealth"
            [highlightCondition]="highlightOpenTasks"
          ></app-table>
        </section>

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

    .project-selector {
      margin-bottom: 1rem;
    }

    .project-selector label {
      display: block;
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .project-selector select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      background: white;
      font-size: 0.875rem;
    }

    .project-selector select:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
  
  selectedProjectId: number | null = null;
  availableProjects: Project[] = [];

  workloadColumns = [
    { key: 'developerName', header: 'Desarrollador', sortable: true },
    { key: 'openTasksCount', header: 'Tareas Abiertas', sortable: true },
    { key: 'averageEstimatedComplexity', header: 'Complejidad Promedio', sortable: true }
  ];

  projectColumns = [
    { key: 'projectName', header: 'Proyecto', sortable: true },
    { key: 'clientName', header: 'Cliente', sortable: true },
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

  constructor(private apiService: ApiService, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadDashboardData();
  }

  loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (response: any) => {
        this.availableProjects = response.data || [];
        this.loadAllProjectHealth();
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  loadDashboardData(): void {
    this.apiService.getDeveloperWorkload().subscribe({
      next: (response: any) => {
        console.log('Raw developer workload response:', response);
        this.developerWorkload = response.data?.map((dw: any) => ({
          developerId: dw.developerId,
          firstName: dw.firstName,
          lastName: dw.lastName,
          email: dw.email,
          openTasksCount: dw.openTasksCount,
          averageEstimatedComplexity: dw.averageEstimatedComplexity,
          developerName: dw.firstName && dw.lastName ? 
            `${dw.firstName} ${dw.lastName}` : 
            dw.developerName || 'Desconocido'
        })) || [];
        console.log('Developer workload transformed:', this.developerWorkload.length);
      },
      error: (error: any) => {
        console.error('Error loading developer workload:', error);
      }
    });

    this.loadProjectHealth();

    this.apiService.getDeveloperDelayRisk().subscribe({
      next: (response: any) => {
        console.log('Raw delay risk response:', response);
        this.delayRisk = response.data?.map((dr: any) => ({
          developerId: dr.developerId,
          firstName: dr.firstName,
          lastName: dr.lastName,
          email: dr.email,
          openTasksCount: dr.openTasksCount,
          avgDelayDays: dr.avgDelayDays,
          nearestDueDate: dr.nearestDueDate,
          latestDueDate: dr.latestDueDate,
          predictedCompletionDate: dr.predictedCompletionDate,
          highRiskFlag: dr.highRiskFlag,
          developerName: dr.firstName && dr.lastName ? 
            `${dr.firstName} ${dr.lastName}` : 
            dr.developerName || 'Desconocido'
        })) || [];
        console.log('Developer delay risk transformed:', this.delayRisk.length);
      },
      error: (error: any) => {
        console.error('Error loading delay risk:', error);
      }
    });
  }

loadAllProjectHealth(): void {
    // Usamos el spread operator [...] para asegurar una nueva referencia de memoria
    this.projectHealth = [...this.availableProjects.map((project: any) => ({
      projectId: project.projectId,
      projectName: project.name,
      clientName: project.clientName,
      status: project.status,
      totalTasks: project.totalTasks,
      openTasks: project.openTasks,
      completedTasks: project.completedTasks
    }))];
    this.cdr.detectChanges(); // Forzamos actualización de la vista
  }

  loadProjectHealth(): void {
    if (!this.selectedProjectId) return;

    this.apiService.getProjectHealth(this.selectedProjectId).subscribe({
      next: (response: any) => {
        // Aseguramos nueva referencia del array
        this.projectHealth = response.data ? [...response.data] : [];
        this.cdr.detectChanges(); // 4. Forzamos que la tabla se entere
        console.log('Project health loaded:', this.projectHealth.length);
      },
      error: (error: any) => {
        console.error('Error loading project health:', error);
      }
    });
  }

 onProjectChange(newId: number | null): void {
    this.selectedProjectId = newId;
    if (this.selectedProjectId) {
      this.loadProjectHealth();
    } else {
      this.loadAllProjectHealth();
    }
  }

  onWorkloadSort(event: { key: string; order: 'asc' | 'desc' }): void {
    this.developerWorkload.sort((a, b) => {
      const aValue = a[event.key as keyof DeveloperWorkload];
      const bValue = b[event.key as keyof DeveloperWorkload];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return event.order === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return event.order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
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

  goToNewTask(): void {
    this.router.navigate(['/new-task']);
  }
}