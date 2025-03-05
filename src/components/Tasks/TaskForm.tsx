import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { format } from 'date-fns';
import { Task } from '../../types';
import { useTaskContext } from '../../contexts/TaskContext';
import { useThemeContext } from '../../contexts/ThemeContext';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  defaultPriority?: Task['priority'];
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, task, defaultPriority }) => {
  const { theme } = useThemeContext();
  const { addTask, updateTask } = useTaskContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(
    task?.priority || defaultPriority || 'important-not-urgent'
  );
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate ? new Date(task.dueDate) : null);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: task?.completed || false,
    };

    if (task) {
      updateTask({ ...task, ...taskData });
    } else {
      addTask(taskData);
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setPriority('important-not-urgent');
    setDueDate(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        color: theme === 'dark' ? '#e0e0e0' : '#333',
        fontWeight: 300,
        letterSpacing: '0.7px'
      }}>
        {task ? 'Edit Task' : 'Add New Task'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title ? 'Title is required' : ''}
            required
            sx={{
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
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel id="priority-label" sx={{ color: '#666' }}>Priority</InputLabel>
            <Select
              labelId="priority-label"
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.15)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.25)'
                }
              }}
            >
              <MenuItem value="urgent-important">Urgent & Important</MenuItem>
              <MenuItem value="important-not-urgent">Important, Not Urgent</MenuItem>
              <MenuItem value="urgent-not-important">Urgent, Not Important</MenuItem>
              <MenuItem value="not-urgent-not-important">Not Urgent, Not Important</MenuItem>
            </Select>
            <FormHelperText sx={{ color: '#777', letterSpacing: '0.2px', fontWeight: 300 }}>
              Select the appropriate quadrant for this task
            </FormHelperText>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={dueDate}
                onChange={(newValue) => setDueDate(newValue)}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'
                        },
                        '&:hover fieldset': {
                          borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)'
                        }
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={handleClose}
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
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#666',
              '&:hover': {
                backgroundColor: '#555'
              }
            }}
          >
            {task ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;