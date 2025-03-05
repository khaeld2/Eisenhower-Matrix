import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionContextType } from '../types';

const SessionContext = createContext<SessionContextType | null>(null);

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      try {
        return JSON.parse(savedSessions, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
      } catch (error) {
        console.error('Error parsing sessions from localStorage:', error);
        return [];
      }
    }
    // Initialize with a default session if no sessions exist
    const defaultSession: Session = {
      id: uuidv4(),
      name: 'Default Session',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return [defaultSession];
  });

  const [currentSession, setCurrentSession] = useState<Session | null>(() => {
    return sessions[0] || null;
  });

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (name: string) => {
    const newSession: Session = {
      id: uuidv4(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
  };

  const switchSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) {
      console.warn('Cannot delete the last session');
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(sessions.find((s) => s.id !== sessionId) || null);
    }
  };

  const updateSessionName = (sessionId: string, name: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, name, updatedAt: new Date() }
          : session
      )
    );
    if (currentSession?.id === sessionId) {
      setCurrentSession((prev) =>
        prev ? { ...prev, name, updatedAt: new Date() } : null
      );
    }
  };

  const value = {
    sessions,
    currentSession,
    addSession,
    switchSession,
    deleteSession,
    updateSessionName,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};