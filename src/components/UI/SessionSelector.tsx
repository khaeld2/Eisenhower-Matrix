import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Tooltip,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSessionContext } from '../../contexts/SessionContext';
import { useThemeContext } from '../../contexts/ThemeContext';

const SessionSelector: React.FC = () => {
  const { theme } = useThemeContext();
  const { sessions, currentSession, addSession, switchSession, deleteSession, updateSessionName } = useSessionContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<{ id: string; name: string } | null>(null);
  const [newSessionName, setNewSessionName] = useState('');
  const [error, setError] = useState('');

  const handleAddSession = () => {
    const trimmedName = newSessionName.trim();
    if (!trimmedName) {
      setError('Session name is required');
      return;
    }
    if (sessions.some(session => session.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('A session with this name already exists');
      return;
    }
    addSession(trimmedName);
    setNewSessionName('');
    setError('');
    setOpenDialog(false);
  };

  const handleUpdateSession = () => {
    const trimmedName = newSessionName.trim();
    if (!editingSession || !trimmedName) {
      setError('Session name is required');
      return;
    }
    const existingSession = sessions.find(
      session => 
        session.name.toLowerCase() === trimmedName.toLowerCase() && 
        session.id !== editingSession.id
    );
    if (existingSession) {
      setError('A session with this name already exists');
      return;
    }
    updateSessionName(editingSession.id, trimmedName);
    setEditingSession(null);
    setNewSessionName('');
    setError('');
    setOpenDialog(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      setError('Cannot delete the last session');
      return;
    }
    try {
      deleteSession(sessionId);
      setError('');
    } catch (error) {
      setError('Failed to delete session');
      console.error('Error deleting session:', error);
    }
  };

  return (
    <Box sx={{ mb: 4, p: 2, backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fafafa', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mr: 3, 
              color: theme === 'dark' ? '#e0e0e0' : '#333', 
              fontWeight: 300,
              letterSpacing: '0.7px'
            }}
          >
            Session
          </Typography>
          <Select
            value={currentSession?.id || ''}
            onChange={(e) => switchSession(e.target.value)}
            size="small"
            sx={{ 
              minWidth: 220,
              backgroundColor: theme === 'dark' ? '#2a2a2a' : 'white',
              color: theme === 'dark' ? '#e0e0e0' : 'inherit',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'
              }
            }}
          >
            {sessions.map((session) => (
              <MenuItem key={session.id} value={session.id}>
                {session.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingSession(null);
            setNewSessionName('');
            setError('');
            setOpenDialog(true);
          }}
          sx={{
            borderColor: 'rgba(0, 0, 0, 0.15)',
            color: '#666',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.25)',
              backgroundColor: 'rgba(0, 0, 0, 0.03)'
            }
          }}
        >
          New Session
        </Button>
      </Box>
    
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          color: '#444',
          fontWeight: 400,
          letterSpacing: '0.5px'
        }}>
          {editingSession ? 'Edit Session' : 'Create New Session'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Session Name"
            fullWidth
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.15)'
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 0, 0, 0.25)'
                }
              }
            }}
          />
          <List sx={{ mt: 3 }}>
            {sessions.map((session) => (
              <ListItem
                component="div"
                key={session.id}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: session.id === currentSession?.id ? 'rgba(0, 0, 0, 0.03)' : 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
                onClick={() => switchSession(session.id)}
              >
                <ListItemText
                  primary={<Typography sx={{ color: '#333', letterSpacing: '0.3px', fontWeight: 400 }}>{session.name}</Typography>}
                  secondary={<Typography variant="caption" sx={{ color: '#777', letterSpacing: '0.2px', fontWeight: 300 }}>{`Created: ${session.createdAt.toLocaleDateString()}`}</Typography>}
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Edit session name">
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSession(session);
                        setNewSessionName(session.name);
                        setError('');
                        setOpenDialog(true);
                      }}
                      sx={{ color: '#888' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete session">
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      sx={{ color: '#888' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ 
              color: '#666',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.03)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editingSession ? handleUpdateSession : handleAddSession}
            variant="contained"
            sx={{
              backgroundColor: '#666',
              '&:hover': {
                backgroundColor: '#555'
              }
            }}
          >
            {editingSession ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionSelector;