import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Task, ProjectTasksFilter, TaskStatus } from '../../models/api.models';
import { TaskStatusChartComponent } from '../task-status-chart/task-status-chart.component';
import { TableComponent } from '../table/table.component';
import { DateFormatPipe } from '../../pipes/date-format.pipe';

@Component({
  selector: 'app-project-tasks',
  standalone: false,
  template: `
    <div class="project-tasks-container">
      <header class="project-header">
        <h1>Tareas del Proyecto {{ projectId }}</h1>
        <button class="btn btn-secondary" (click)="goBack()">← Volver</button>
      </header>

      <div class="filters-section">
        <div class="filter-group">
          <label for="status-filter">Filtrar por estado:</label>
          <select id="status-filter" [(ngModel)]="filter.status" (change)="loadTasks()">
            <option value="">Todos</option>
            <option *ngFor="let status of availableStatuses" [value]="status.code">
              {{ status.description }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="developer-filter">Filtrar por desarrollador:</label>
          <select id="developer-filter" [(ngModel)]="filter.developer" (change)="loadTasks()">
            <option value="">Todos</option>
            <option *ngFor="let developer of availableDevelopers" [value]="developer">
              {{ developer }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="page-size">Mostrar:</label>
          <select id="page-size" [(ngModel)]="filter.pageSize" (change)="loadTasks()">
            <option [ngValue]="10">10</option>
            <option [ngValue]="25">25</option>
            <option [ngValue]="50">50</option>
          </select>
        </div>
      </div>

      <app-task-status-chart [tasks]="tasks"></app-task-status-chart>

      <section class="tasks-table-section">
        <app-table
          [columns]="taskColumns"
          [data]="tasks"
          (rowClick)="showTaskDetails($event)"
        ></app-table>
      </section>

      <div class="pagination" *ngIf="totalCount && totalCount > (filter.pageSize || 10)">
        <button 
          class="btn btn-pagination" 
          [disabled]="currentPage === 1"
          (click)="changePage(currentPage - 1)"
        >
          Anterior
        </button>
        
        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }}
          ({{ totalCount }} tareas totales)
        </span>
        
        <button 
          class="btn btn-pagination" 
          [disabled]="currentPage === totalPages"
          (click)="changePage(currentPage + 1)"
        >
          Siguiente
        </button>
      </div>

      <!-- Task detail modal -->
      <div class="modal-overlay" *ngIf="selectedTask" (click)="closeTaskDetails()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ selectedTask.title }}</h3>
            <button class="btn-close" (click)="closeTaskDetails()">×</button>
          </div>
          <div class="modal-body">
            <div class="task-detail">
              <strong>Descripción:</strong>
              <p>{{ selectedTask.description || 'Sin descripción' }}</p>
            </div>
            <div class="task-detail">
              <strong>Asignado a:</strong> {{ selectedTask.assignedTo }}
            </div>
            <div class="task-detail">
              <strong>Estado:</strong> {{ selectedTask.status }}
            </div>
            <div class="task-detail">
              <strong>Prioridad:</strong> {{ selectedTask.priority }}
            </div>
            <div class="task-detail">
              <strong>Complejidad estimada:</strong> {{ selectedTask.estimatedComplexity }}
            </div>
            <div class="task-detail">
              <strong>Fecha de creación:</strong> {{ selectedTask.createdDate | date_format }}
            </div>
            <div class="task-detail">
              <strong>Fecha de vencimiento:</strong> {{ selectedTask.dueDate | date_format }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-tasks-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #dee2e6;
    }

    .project-header h1 {
      color: #2c3e50;
      margin: 0;
    }

    .filters-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-group label {
      font-weight: 500;
      color: #495057;
    }

    .filter-group select {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: white;
      min-width: 150px;
    }

    .tasks-table-section {
      margin-bottom: 2rem;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .page-info {
      color: #6c757d;
      font-size: 14px;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-pagination {
      background: #007bff;
      color: white;
    }

    .btn-pagination:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-pagination:disabled {
      background: #e9ecef;
      color: #6c757d;
      cursor: not-allowed;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 0;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6c757d;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close:hover {
      color: #495057;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .task-detail {
      margin-bottom: 1rem;
    }

    .task-detail strong {
      color: #495057;
    }

    @media (max-width: 768px) {
      .project-tasks-container {
        padding: 1rem;
      }

      .project-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .filters-section {
        flex-direction: column;
      }

      .pagination {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class ProjectTasksComponent implements OnInit {
  projectId: number = 0;
  tasks: Task[] = [];
  availableStatuses: TaskStatus[] = [];
  availableDevelopers: string[] = [];
  
  filter: ProjectTasksFilter = {
    status: '',
    developer: '',
    page: 1,
    pageSize: 10
  };

  totalCount: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  
  selectedTask: Task | null = null;

  taskColumns = [
    { key: 'title', header: 'Título' },
    { key: 'assignedTo', header: 'Asignado a' },
    { key: 'status', header: 'Estado' },
    { key: 'priority', header: 'Prioridad' },
    { key: 'estimatedComplexity', header: 'Complejidad' },
    { key: 'createdDate', header: 'Fecha Creación' },
    { key: 'dueDate', header: 'Fecha Vencimiento' }
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DateFormatPipe
  ) {}

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTasks();
    this.loadAvailableFilters();
  }

  loadTasks(): void {
    this.filter.page = this.currentPage;
    
    this.apiService.getProjectTasks(this.projectId, this.filter).subscribe({
      next: (response: any) => {
        if (response.data) {
          this.tasks = response.data.data;
          this.totalCount = response.data.totalCount;
          this.currentPage = response.data.currentPage;
          this.totalPages = Math.ceil(this.totalCount / this.filter.pageSize!);
          
          // Update available developers
          this.availableDevelopers = [...new Set(this.tasks.map(task => task.assignedTo))];
        }
      },
      error: (error: any) => {
        console.error('Error loading project tasks:', error);
      }
    });

    this.apiService.getTaskStatuses().subscribe({
      next: (response: any) => {
        this.availableStatuses = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading task statuses:', error);
      }
    });
  }

  loadAvailableFilters(): void {
    this.apiService.getTaskStatuses().subscribe({
      next: (response) => {
        this.availableStatuses = response.data || [];
      },
      error: (error) => {
        console.error('Error loading task statuses:', error);
      }
    });

    // Extract unique developers from current tasks
    if (this.tasks.length > 0) {
      this.availableDevelopers = [...new Set(this.tasks.map(task => task.assignedTo))];
    }
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadTasks();
    }
  }

  showTaskDetails(task: Task): void {
    this.selectedTask = task;
  }

  closeTaskDetails(): void {
    this.selectedTask = null;
  }

  goBack(): void {
    window.history.back();
  }
}