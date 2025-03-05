import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../types';

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  getNotesByTag: (tag: string) => Note[];
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNoteContext = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNoteContext must be used within a NoteProvider');
  }
  return context;
};

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider: React.FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      try {
        // Parse dates from strings back to Date objects
        return JSON.parse(savedNotes, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
      } catch (error) {
        console.error('Error parsing notes from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newNote: Note = {
      ...noteData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id
          ? { ...updatedNote, updatedAt: new Date() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const getNoteById = (id: string) => {
    return notes.find((note) => note.id === id);
  };

  const getNotesByTag = (tag: string) => {
    return notes.filter((note) => note.tags.includes(tag));
  };

  const value = {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByTag,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};