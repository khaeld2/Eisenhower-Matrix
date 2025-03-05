import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { useSessionContext } from './SessionContext';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'sessionId'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  getTasksByPriority: (priority: Task['priority']) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { currentSession } = useSessionContext();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks, (key, value) => {
          if ((key === 'dueDate' || key === 'createdAt') && value) {
            return new Date(value);
          }
          return value;
        });
        return Array.isArray(parsedTasks) ? parsedTasks : [];
      } catch (error) {
        console.error('Error parsing tasks from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  const sessionTasks = tasks.filter(task => task.sessionId === currentSession?.id);

  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'sessionId'>) => {
    if (!currentSession) {
      console.error('Cannot add task: No active session');
      return;
    }
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      sessionId: currentSession.id
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    if (!currentSession || updatedTask.sessionId !== currentSession.id) {
      console.error('Cannot update task: Invalid session');
      return;
    }
    setTasks(prevTasks =>
      prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksByPriority = (priority: Task['priority']) => {
    return sessionTasks.filter(task => task.priority === priority);
  };

  const value = {
    tasks: sessionTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTasksByPriority,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};