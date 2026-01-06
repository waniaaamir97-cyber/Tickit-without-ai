
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  tags: string[];
  category: string;
  subtasks: SubTask[];
  assignedTo?: string;
  xpValue: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  completedTasks: number;
  joinedDate: string;
  streak: number;
  lastActive: string;
  badges: Badge[];
}

export interface AppState {
  tasks: Task[];
  user: UserProfile;
  theme: 'light' | 'dark' | 'indigo';
}
