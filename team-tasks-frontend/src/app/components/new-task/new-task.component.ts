import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CreateTaskRequest } from '../../models/api.models';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="new-task-container">
      <div class="new-task-header">
        <h1>Nueva Tarea</h1>
        <button class="btn btn-secondary" (click)="goBack()">← Cancelar</button>
      </div>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form">
        <div class="form-group">
          <label for="project">Proyecto *</label>
          <select id="project" formControlName="projectId" class="form-control">
            <option value="">Seleccionar proyecto</option>
            <option *ngFor="let project of availableProjects" [value]="project.id">
              {{ project.name }} ({{ project.client }})
            </option>
          </select>
          <div class="error-message" *ngIf="taskForm.get('projectId')?.invalid && taskForm.get('projectId')?.touched">
            El proyecto es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="title">Título *</label>
          <input 
            id="title" 
            type="text" 
            formControlName="title" 
            class="form-control"
            placeholder="Ingresa el título de la tarea"
          >
          <div class="error-message" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
            El título es requerido y debe tener al menos 3 caracteres
          </div>
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea 
            id="description" 
            formControlName="description" 
            class="form-control"
            rows="4"
            placeholder="Ingresa una descripción detallada de la tarea"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="assignedTo">Asignado a *</label>
            <select id="assignedTo" formControlName="assignedTo" class="form-control">
              <option value="">Seleccionar desarrollador</option>
              <option *ngFor="let developer of availableDevelopers" [value]="developer">
                {{ developer }}
              </option>
            </select>
            <div class="error-message" *ngIf="taskForm.get('assignedTo')?.invalid && taskForm.get('assignedTo')?.touched">
              Debe asignar la tarea a un desarrollador
            </div>
          </div>

          <div class="form-group">
            <label for="status">Estado *</label>
            <select id="status" formControlName="status" class="form-control">
              <option value="">Seleccionar estado</option>
              <option *ngFor="let status of availableStatuses" [value]="status">
                {{ status }}
              </option>
            </select>
            <div class="error-message" *ngIf="taskForm.get('status')?.invalid && taskForm.get('status')?.touched">
              El estado es requerido
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">Prioridad *</label>
            <select id="priority" formControlName="priority" class="form-control">
              <option value="">Seleccionar prioridad</option>
              <option *ngFor="let priority of availablePriorities" [value]="priority">
                {{ priority }}
              </option>
            </select>
            <div class="error-message" *ngIf="taskForm.get('priority')?.invalid && taskForm.get('priority')?.touched">
              La prioridad es requerida
            </div>
          </div>

          <div class="form-group">
            <label for="estimatedComplexity">Complejidad estimada *</label>
            <input 
              id="estimatedComplexity" 
              type="number" 
              formControlName="estimatedComplexity" 
              class="form-control"
              min="1"
              max="10"
              placeholder="1-10"
            >
            <div class="error-message" *ngIf="taskForm.get('estimatedComplexity')?.invalid && taskForm.get('estimatedComplexity')?.touched">
              La complejidad debe estar entre 1 y 10
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="dueDate">Fecha de vencimiento *</label>
          <input 
            id="dueDate" 
            type="date" 
            formControlName="dueDate" 
            class="form-control"
          >
          <div class="error-message" *ngIf="taskForm.get('dueDate')?.invalid && taskForm.get('dueDate')?.touched">
            La fecha de vencimiento es requerida y debe ser futura
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Guardando...' : 'Crear Tarea' }}
          </button>
        </div>
      </form>

      <!-- Success/Error messages -->
      <div class="alert alert-success" *ngIf="successMessage">
        {{ successMessage }}
      </div>
      
      <div class="alert alert-error" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .new-task-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .new-task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #dee2e6;
    }

    .new-task-header h1 {
      color: #2c3e50;
      margin: 0;
    }

    .task-form {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.ng-invalid.ng-touched {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #dee2e6;
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

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .btn-primary:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .new-task-container {
        padding: 1rem;
      }

      .task-form {
        padding: 1rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class NewTaskComponent implements OnInit {
  taskForm: FormGroup;
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  availableProjects: any[] = [];
  availableDevelopers: string[] = [];
  availableStatuses: string[] = [];
  availablePriorities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      estimatedComplexity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      dueDate: ['', [Validators.required, this.futureDateValidator]]
    });
  }

  ngOnInit(): void {
    this.loadFormData();
  }

  futureDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate <= today ? { futureDate: true } : null;
  }

  loadFormData(): void {
    this.apiService.getProjects().subscribe({
      next: (response: any) => {
        this.availableProjects = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading projects:', error);
        this.errorMessage = 'Error al cargar los proyectos';
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

    this.apiService.getTaskPriorities().subscribe({
      next: (response: any) => {
        this.availablePriorities = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading task priorities:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const taskData: CreateTaskRequest = this.taskForm.value;

    this.apiService.createTask(taskData).subscribe({
      next: (response: any) => {
        if (response.succeeded) {
          this.successMessage = 'Tarea creada exitosamente';
          this.taskForm.reset();
          setTimeout(() => {
            this.goBack();
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Error al crear la tarea';
        }
      },
      error: (error: any) => {
        console.error('Error creating task:', error);
        this.errorMessage = 'Error al crear la tarea. Por favor, intente nuevamente.';
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}