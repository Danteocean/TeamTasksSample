export interface ApiResponse<T> {
  data: T;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface DeveloperWorkload {
  developer: string;
  openTasksCount: number;
  totalEstimatedComplexity: number;
}

export interface ProjectHealth {
  project: string;
  client: string;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export interface DeveloperDelayRisk {
  developerName: string;
  openTasksCount: number;
  avgDelayDays: number;
  nearestDueDate: string;
  latestDueDate: string;
  predictedCompletionDate: string;
  highRiskFlag: boolean;
}

export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
  priority: string;
  estimatedComplexity: number;
  createdDate: string;
  dueDate: string;
  projectId?: number;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export interface ProjectTasksFilter {
  status?: string;
  developer?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface CreateTaskRequest {
  projectId: number;
  title: string;
  description: string;
  assignedTo: string;
  status: string;
  priority: string;
  estimatedComplexity: number;
  dueDate: string;
}