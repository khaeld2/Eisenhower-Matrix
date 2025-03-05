export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: Date | null;
  priority: 'urgent-important' | 'important-not-urgent' | 'urgent-not-important' | 'not-urgent-not-important';
  createdAt: Date;
  sessionId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  taskId?: string; // Optional reference to a task
}

export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionContextType {
  sessions: Session[];
  currentSession: Session | null;
  addSession: (name: string) => void;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionName: (sessionId: string, name: string) => void;
}