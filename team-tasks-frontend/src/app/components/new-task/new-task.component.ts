import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import {
  CreateTaskRequest,
  Project,
  Developer,
  TaskPriority,
  TaskStatus
} from '../../models/api.models';

@Component({
  selector: 'app-new-task',
  standalone: false,
  template: `
    <div class="new-task-container">
      <div class="new-task-header">
        <h1>Nueva Tarea</h1>
        <button type="button" class="btn btn-secondary" (click)="goBack()">← Cancelar</button>
      </div>

      <div class="form-wrapper">
        @if (isLoading) {
          <div class="loading-overlay">
            <div class="spinner-container">
              <div class="loading-spinner"></div>
              <p>Cargando selectores...</p>
            </div>
          </div>
        }

        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="task-form" [class.blurred]="isLoading">
          <div class="form-group">
            <label>Proyecto *</label>
            <select formControlName="projectId" class="form-control">
              <option value="">Seleccionar proyecto</option>
              @for (p of availableProjects; track p.projectId) {
                <option [value]="p.projectId">{{ p.name }} ({{ p.clientName }})</option>
              }
            </select>
          </div>

          <div class="form-group">
            <label>Título *</label>
            <input class="form-control" formControlName="title" placeholder="Ej: Fix login bug" />
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea class="form-control" formControlName="description"></textarea>
          </div>

          <div class="grid-row">
            <div class="form-group">
              <label>Asignado a *</label>
              <select class="form-control" formControlName="assignedTo">
                <option value="">Seleccionar desarrollador</option>
                @for (d of availableDeveloper; track d.developerId) {
                  <option [value]="d.developerId">{{ d.firstName }} {{ d.lastName }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Estado *</label>
              <select class="form-control" formControlName="status">
                <option value="">Seleccionar estado</option>
                @for (s of availableStatuses; track s.taskStatusId) {
                  <option [value]="s.taskStatusId">{{ s.description }}</option>
                }
              </select>
            </div>
          </div>

          <div class="grid-row">
            <div class="form-group">
              <label>Prioridad *</label>
              <select class="form-control" formControlName="priority">
                <option value="">Seleccionar prioridad</option>
                @for (p of availablePriorities; track p.taskPriorityId) {
                  <option [value]="p.taskPriorityId">{{ p.description }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label>Complejidad (1–10)</label>
              <input type="number" class="form-control" formControlName="estimatedComplexity" min="1" max="10" />
            </div>
          </div>

          <div class="form-group">
            <label>Fecha vencimiento *</label>
            <input type="date" class="form-control" formControlName="dueDate" 
                   [class.is-invalid]="taskForm.get('dueDate')?.touched && taskForm.get('dueDate')?.errors" />
            @if (taskForm.get('dueDate')?.hasError('futureDate')) {
              <small style="color: red; display: block; margin-top: 5px;">La fecha debe ser hoy o a futuro.</small>
            }
          </div>

          <button type="submit" class="btn btn-primary" [disabled]="taskForm.invalid || isSubmitting || isLoading">
            {{ isSubmitting ? 'Guardando...' : 'Crear Tarea' }}
          </button>
        </form>
      </div>

      @if (successMessage) { <div class="alert alert-success">{{ successMessage }}</div> }
      @if (errorMessage) { <div class="alert alert-danger">{{ errorMessage }}</div> }
    </div>
  `,
  styles: [`
    .new-task-container { max-width: 700px; margin: 2rem auto; padding: 1rem; font-family: sans-serif; }
    .new-task-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .form-wrapper { position: relative; min-height: 400px; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
    .loading-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(255, 255, 255, 0.8);
      z-index: 10; display: flex; justify-content: center; align-items: center; border-radius: 8px;
    }
    .spinner-container { text-align: center; }
    .loading-spinner {
      width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #3498db;
      border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .blurred { filter: blur(2px); pointer-events: none; }
    .form-group { margin-bottom: 1.2rem; }
    .grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .form-control { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    .btn { padding: 10px 20px; cursor: pointer; border-radius: 4px; border: none; }
    .btn-primary { background: #007bff; color: white; width: 100%; font-weight: bold; }
    .btn-primary:disabled { background: #ccc; }
    .btn-secondary { background: #6c757d; color: white; }
    .alert { margin-top: 1rem; padding: 1rem; border-radius: 4px; text-align: center; }
    .alert-success { background: #d4edda; color: #155724; }
    .alert-danger { background: #f8d7da; color: #721c24; }
    .is-invalid { border-color: #dc3545 !important; }
  `]
})
export class NewTaskComponent implements OnInit {
  taskForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  availableProjects: Project[] = [];
  availableDeveloper: Developer[] = [];
  availableStatuses: TaskStatus[] = [];
  availablePriorities: TaskPriority[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      projectId: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      estimatedComplexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      dueDate: ['', [Validators.required, futureDateValidator()]]
    });

    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      projects: this.api.getProjects(),
      statuses: this.api.getTaskStatuses(),
      priorities: this.api.getTaskPriorities(),
      developers: this.api.getDeveloper()
    }).subscribe({
      next: (res) => {
        this.availableProjects = res.projects.data ?? [];
        this.availableStatuses = res.statuses.data ?? [];
        this.availablePriorities = res.priorities.data ?? [];
        this.availableDeveloper = res.developers.data ?? [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error cargando selectores", err);
        this.errorMessage = "Error al cargar los datos iniciales";
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
  if (this.taskForm.invalid) return;
  this.isSubmitting = true;

  const formValues = this.taskForm.value;

  // Mapeo exacto según el body que me pasaste
  const payload = {
    projectId: Number(formValues.projectId),
    title: formValues.title,
    description: formValues.description,
    assigneeId: Number(formValues.assignedTo), // Cambio de nombre
    taskStatusId: Number(formValues.status),   // Cambio de nombre e ID numérico
    taskPriorityId: Number(formValues.priority), // Cambio de nombre e ID numérico
    estimatedComplexity: Number(formValues.estimatedComplexity),
    dueDate: new Date(formValues.dueDate).toISOString(), // Formato ISO solicitado
    createdBy: "Sistema" // O el nombre del usuario actual si lo tienes
  };

  console.log("Payload final para el backend:", payload);

  this.api.createTask(payload).subscribe({
    next: (res) => {
      console.log("Respuesta servidor:", res);
      this.successMessage = 'Tarea creada correctamente';
      this.isSubmitting = false;
      this.cdr.detectChanges();
      setTimeout(() => this.goBack(), 1200);
    },
    error: (err) => {
      console.error("Error del backend:", err);
      this.errorMessage = 'Error: ' + (err.error?.message || 'No se pudo guardar');
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  });
}

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return null;
    const [year, month, day] = control.value.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? { futureDate: true } : null;
  };
}