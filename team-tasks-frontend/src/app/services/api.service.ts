import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiResponse,
  DeveloperWorkload,
  ProjectHealth,
  DeveloperDelayRisk,
  Task,
  Project,
  ProjectTasksFilter,
  PaginatedResponse,
  CreateTaskRequest,
  TaskStatus,
  TaskPriority,
  Developer
} from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Dashboard endpoints
  getDeveloperWorkload(): Observable<ApiResponse<DeveloperWorkload[]>> {
    return this.http.get<ApiResponse<DeveloperWorkload[]>>(`${this.apiUrl}/dashboard/developer-workload`);
  }

  getProjectHealth(projectId: number): Observable<ApiResponse<ProjectHealth[]>> {
    return this.http.get<ApiResponse<ProjectHealth[]>>(`${this.apiUrl}/dashboard/project-health/${projectId}`);
  }

  getDeveloperDelayRisk(): Observable<ApiResponse<DeveloperDelayRisk[]>> {
    return this.http.get<ApiResponse<DeveloperDelayRisk[]>>(`${this.apiUrl}/dashboard/developer-delay-risk`);
  }

  // Projects endpoints
  getProjects(): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(`${this.apiUrl}/projects`);
  }

  getProjectTasks(projectId: number, filter: ProjectTasksFilter): Observable<ApiResponse<PaginatedResponse<Task>>> {
    const params = new URLSearchParams();

    if (filter.status) params.append('status', filter.status);
    if (filter.developer) params.append('developer', filter.developer);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    return this.http.get<ApiResponse<PaginatedResponse<Task>>>(
      `${this.apiUrl}/projects/${projectId}/tasks?${params.toString()}`
    );
  }

  // Tasks endpoints
  createTask(task: CreateTaskRequest): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/tasks`, task);
  }

  updateTaskStatus(id: number, status: string): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/tasks/${id}/status`, { status });
  }

  // Statuses and priorities
  getTaskStatuses(): Observable<ApiResponse<TaskStatus[]>> {
    return this.http.get<ApiResponse<TaskStatus[]>>(`${this.apiUrl}/Status/TaskStatuses`);
  }

  getTaskPriorities(): Observable<ApiResponse<TaskPriority[]>> {
    return this.http.get<ApiResponse<TaskPriority[]>>(`${this.apiUrl}/status/TaskPriorities`);
  }

  getTasks(): Observable<ApiResponse<Task[]>> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}/tasks`);
  }

  getDeveloper(): Observable<ApiResponse<Developer[]>> {
    return this.http.get<ApiResponse<Developer[]>>(`${this.apiUrl}/developers`);
  }
  

  deleteTask(taskId: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/tasks/${taskId}`);
  }

  updateTask(taskId: number, task: Partial<CreateTaskRequest>): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/tasks/${taskId}`, task);
  }

  // Project status
  getProjectStatuses(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/status/ProjectStatuses`);
  }

}
