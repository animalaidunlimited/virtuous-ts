export interface Task {
  id: number;
  taskType?: string;
  task?: string;
  description?: string;
  dueDateTime?: string;
  contactId?: number;
  contact?: string;
  contactUrl?: string;
}

export interface CreateTaskRequest {
  taskType?: string;
  task: string;
  description?: string;
  dueDateTime?: string;
  contactId?: number;
}
