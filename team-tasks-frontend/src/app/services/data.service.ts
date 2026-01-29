import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import {
  ApiResponse,
  DeveloperWorkload,
  Project,
  Task,
  TaskStatus,
  TaskPriority
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private cacheKey = 'tt_cache_v1';

  private _projects$ = new BehaviorSubject<Project[]>([]);
  private _developers$ = new BehaviorSubject<DeveloperWorkload[]>([]);
  private _taskStatuses$ = new BehaviorSubject<TaskStatus[]>([]);
  private _taskPriorities$ = new BehaviorSubject<TaskPriority[]>([]);
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _error$ = new BehaviorSubject<string | null>(null);
  private _initialized$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService) {}

  // Observable getters
  get projects$(): Observable<Project[]> {
    return this._projects$.asObservable();
  }

  get developers$(): Observable<DeveloperWorkload[]> {
    return this._developers$.asObservable();
  }

  get taskStatuses$(): Observable<TaskStatus[]> {
    return this._taskStatuses$.asObservable();
  }

  get taskPriorities$(): Observable<TaskPriority[]> {
    return this._taskPriorities$.asObservable();
  }

  get tasks$(): Observable<Task[]> {
    return this._tasks$.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  get error$(): Observable<string | null> {
    return this._error$.asObservable();
  }

  get initialized$(): Observable<boolean> {
    return this._initialized$.asObservable();
  }

  // Sync getters for current values
  get projects(): Project[] {
    return this._projects$.value;
  }

  get developers(): DeveloperWorkload[] {
    return this._developers$.value;
  }

  get taskStatuses(): TaskStatus[] {
    return this._taskStatuses$.value;
  }

  get taskPriorities(): TaskPriority[] {
    return this._taskPriorities$.value;
  }

  get tasks(): Task[] {
    return this._tasks$.value;
  }

  get loading(): boolean {
    return this._loading$.value;
  }

  get error(): string | null {
    return this._error$.value;
  }

  get initialized(): boolean {
    return this._initialized$.value;
  }

  // Load initial data from cache or from backend
  loadInitialData(): void {
    console.log('🚀 DataService.loadInitialData() called');
    
    if (this._loading$.value || this._initialized$.value) {
      console.log('⚠️ Already loading or initialized, skipping');
      return;
    }

    console.log('📊 Starting data load process...');
    this._loading$.next(true);
    this._error$.next(null);

    // Safety timeout: stop loading if not loaded in 30 seconds
    const safetyTimeout = setTimeout(() => {
      console.error('⏰ Safety timeout reached, stopping loading');
      this._loading$.next(false);
      this._error$.next('Tiempo de espera agotado. Por favor, recargue la página.');
    }, 30000);

    const cached = localStorage.getItem(this.cacheKey);
    if (cached) {
      try {
        console.log('📦 Found cache, loading from localStorage');
        const cacheData = JSON.parse(cached);
        
        this._projects$.next(cacheData.projects || []);
        this._developers$.next(cacheData.developers || []);
        this._taskStatuses$.next(cacheData.taskStatuses || []);
        this._taskPriorities$.next(cacheData.taskPriorities || []);
        this._tasks$.next(cacheData.tasks || []);
        this._initialized$.next(true);
        this._loading$.next(false);
        clearTimeout(safetyTimeout);
        
        console.log('✅ Loaded initial data from cache (localStorage).');
        return;
      } catch (e) {
        console.error('Error parsing cache, will reload from API', e);
        // fallthrough to load from API
      }
    }

    console.log('📦 No cache found, loading from API');
    
    // Load from API with simple approach
    forkJoin([
      this.apiService.getProjects().pipe(
        map(r => r.data || []),
        catchError(err => {
          console.error('❌ Projects API error:', err);
          return of([]);
        })
      ),
      this.apiService.getDeveloperWorkload().pipe(
        map(r => r.data || []),
        catchError(err => {
          console.error('❌ Developers API error:', err);
          return of([]);
        })
      ),
      this.apiService.getTaskStatuses().pipe(
        map(r => r.data || []),
        catchError(err => {
          console.error('❌ TaskStatuses API error:', err);
          return of([]);
        })
      ),
      this.apiService.getTaskPriorities().pipe(
        map(r => r.data || []),
        catchError(err => {
          console.error('❌ TaskPriorities API error:', err);
          return of([]);
        })
      ),
      this.apiService.getTasks().pipe(
        map(r => r.data || []),
        catchError(err => {
          console.error('❌ Tasks API error:', err);
          return of([]);
        })
      )
    ]).subscribe({
      next: ([projects, developers, taskStatuses, taskPriorities, tasks]) => {
        console.log('📊 All API responses received:', {
          projects: projects.length,
          developers: developers.length,
          taskStatuses: taskStatuses.length,
          taskPriorities: taskPriorities.length,
          tasks: tasks.length
        });

        this._projects$.next(projects);
        this._developers$.next(developers);
        this._taskStatuses$.next(taskStatuses);
        this._taskPriorities$.next(taskPriorities);
        this._tasks$.next(tasks);
        
        // Save to cache
        const cacheData = {
          projects: projects,
          developers: developers,
          taskStatuses: taskStatuses,
          taskPriorities: taskPriorities,
          tasks: tasks
        };
        
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        this._initialized$.next(true);
        this._loading$.next(false);
        clearTimeout(safetyTimeout);
        
        console.log('✅ All initial data loaded from API and cached to localStorage.');
      },
      error: (err) => {
        console.error('❌ Error loading initial data:', err);
        this._error$.next('Error al cargar datos iniciales');
        this._loading$.next(false);
        clearTimeout(safetyTimeout);
      }
    });
  }

  // Update only tasks from API and cache them
  refreshTasks(): void {
    console.log('🔄 DataService.refreshTasks() called');
    
    this.apiService.getTasks().subscribe({
      next: (resp: any) => {
        const data: Task[] = resp?.data || [];
        this._tasks$.next(data);
        
        // Update cache
        const cacheRaw = localStorage.getItem(this.cacheKey);
        const cacheObj = cacheRaw ? JSON.parse(cacheRaw) : {
          projects: this._projects$.value,
          developers: this._developers$.value,
          taskStatuses: this._taskStatuses$.value,
          taskPriorities: this._taskPriorities$.value,
          tasks: data
        };
        
        const updatedCache = {
          ...cacheObj,
          tasks: data
        };
        
        localStorage.setItem(this.cacheKey, JSON.stringify(updatedCache));
        console.log('✅ Tasks refreshed and cache updated.');
      },
      error: (err) => {
        console.error('❌ Error refreshing tasks:', err);
      }
    });
  }

  // Clear all cache
  clearCache(): void {
    console.log('🗑️ DataService.clearCache() called');
    localStorage.removeItem(this.cacheKey);
    this._projects$.next([]);
    this._developers$.next([]);
    this._taskStatuses$.next([]);
    this._taskPriorities$.next([]);
    this._tasks$.next([]);
    this._initialized$.next(false);
    this._loading$.next(false);
  }

  // Utility: Get developer full name
  getDeveloperFullName(dev: DeveloperWorkload): string {
    return `${dev.firstName} ${dev.lastName}`.trim();
  }

  // Utility: Get task status by code
  getTaskStatusByCode(code: string): TaskStatus | undefined {
    return this._taskStatuses$.value.find(status => status.code === code);
  }

  // Utility: Get task priority by code
  getTaskPriorityByCode(code: string): TaskPriority | undefined {
    return this._taskPriorities$.value.find(priority => priority.code === code);
  }

  // Utility: Get project by ID
  getProjectById(projectId: number): Project | undefined {
    return this._projects$.value.find(project => project.projectId === projectId);
  }
}