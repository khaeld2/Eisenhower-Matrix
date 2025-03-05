import React, { useState } from 'react';
import { Grid, Paper, Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useTaskContext } from '../../contexts/TaskContext';
import { useThemeContext } from '../../contexts/ThemeContext';
import { Task } from '../../types';
import TaskForm from './TaskForm';

const TaskMatrix: React.FC = () => {
  const { theme } = useThemeContext();
  const { getTasksByPriority, toggleTaskCompletion, deleteTask } = useTaskContext();
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const quadrants = [
    {
      title: 'Urgent & Important',
      priority: 'urgent-important' as Task['priority'],
      color: theme === 'dark' ? '#2d2424' : '#f8f0f0',
    },
    {
      title: 'Important, Not Urgent',
      priority: 'important-not-urgent' as Task['priority'],
      color: theme === 'dark' ? '#243124' : '#f0f8f0',
    },
    {
      title: 'Urgent, Not Important',
      priority: 'urgent-not-important' as Task['priority'],
      color: theme === 'dark' ? '#313124' : '#f8f8f0',
    },
    {
      title: 'Not Urgent, Not Important',
      priority: 'not-urgent-not-important' as Task['priority'],
      color: theme === 'dark' ? '#242424' : '#f8f8f8',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 4, px: 2 }}>
      <Grid container spacing={3}>
        {quadrants.map((quadrant) => (
          <Grid item xs={12} md={6} key={quadrant.priority}>
            <Paper
              sx={{
                p: 3,
                height: '340px',
                backgroundColor: quadrant.color,
                borderRadius: 2,
                boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '4px',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: theme === 'dark' ? '#e0e0e0' : '#333', fontWeight: 300, letterSpacing: '0.7px' }}>
                  {quadrant.title}
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedTask(undefined);
                    setOpenTaskForm(true);
                  }}
                  variant="outlined"
                  sx={{
                    borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                    color: theme === 'dark' ? '#e0e0e0' : '#666',
                    borderRadius: 20,
                    '&:hover': {
                      borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                    },
                  }}
                >
                  Add
                </Button>
              </Box>
              {getTasksByPriority(quadrant.priority).map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: theme === 'dark' ? '#2a2a2a' : 'white',
                    borderRadius: 2,
                    boxShadow: theme === 'dark' ? '0 1px 4px rgba(0, 0, 0, 0.2)' : '0 1px 4px rgba(0, 0, 0, 0.03)',
                    opacity: task.completed ? 0.6 : 1,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: theme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.06)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: theme === 'dark' ? '#e0e0e0' : '#333', mb: 0.5, fontWeight: 400, letterSpacing: '0.3px' }}>{task.title}</Typography>
                      <Typography variant="body2" sx={{ color: theme === 'dark' ? '#b0b0b0' : '#555', mb: task.dueDate ? 1 : 0, letterSpacing: '0.2px', lineHeight: 1.5 }}>
                        {task.description}
                      </Typography>
                      {task.dueDate && (
                        <Typography variant="caption" sx={{ color: theme === 'dark' ? '#888' : '#777', letterSpacing: '0.2px', fontWeight: 300 }}>
                          Due: {task.dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                        <IconButton
                          size="small"
                          onClick={() => toggleTaskCompletion(task.id)}
                          sx={{ color: theme === 'dark' ? (task.completed ? '#888' : '#b0b0b0') : (task.completed ? '#888' : '#666') }}
                        >
                          {task.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit task">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedTask(task);
                            setOpenTaskForm(true);
                          }}
                          sx={{ color: theme === 'dark' ? '#888' : '#888' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete task">
                        <IconButton
                          size="small"
                          onClick={() => deleteTask(task.id)}
                          sx={{ color: theme === 'dark' ? '#888' : '#888' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <TaskForm
        open={openTaskForm}
        onClose={() => setOpenTaskForm(false)}
        task={selectedTask}
      />
    </Box>
  );
};

export default TaskMatrix;