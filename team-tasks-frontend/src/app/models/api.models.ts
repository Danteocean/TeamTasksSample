export interface ApiResponse<T> {
  data: T;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface DeveloperWorkload {
  developerId: number;
  firstName: string;
  lastName: string;
  email: string;
  openTasksCount?: number;
  averageEstimatedComplexity?: number;
}

export interface Developer {
  developerId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProjectHealth {
  projectId: number;
  projectName: string;
  clientName: string;
  status: string;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export interface DeveloperDelayRisk {
  developerId: number;
  firstName: string;
  lastName: string;
  email: string;
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
  projectId: number;
  name: string;
  clientName: string;
  status: string;
  totalTasks: number;
  openTasks: number;
  completedTasks: number;
}

export interface ProjectStatus {
  projectStatusId: number;
  code: string;
  description: string;
}

export interface TaskPriority {
  taskPriorityId: number;
  code: string;
  description: string;
  level: number;
}

export interface TaskStatus {
  taskStatusId: number;
  code: string;
  description: string;
  isFinal: boolean;
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
  assigneeId: number;
  taskStatusId: number;
  taskPriorityId: number;
  estimatedComplexity: number;
  dueDate: string;
}