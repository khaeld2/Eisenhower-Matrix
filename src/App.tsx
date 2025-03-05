import { CssBaseline, Container, Box, Typography, IconButton, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { TaskProvider } from './contexts/TaskContext';
import { NoteProvider } from './contexts/NoteContext';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider, useThemeContext } from './contexts/ThemeContext';
import TaskMatrix from './components/Tasks/TaskMatrix';
import SessionSelector from './components/UI/SessionSelector';
import Footer from './components/UI/Footer';
import './App.css'

const AppContent = () => {
  const { theme, toggleTheme } = useThemeContext();

  const muiTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: theme === 'light' ? '#ffffff' : '#121212',
            transition: 'background-color 0.3s ease'
          }
        }
      }
    },
    palette: {
      mode: theme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: theme === 'light' ? '#ffffff' : '#121212',
        paper: theme === 'light' ? '#f5f5f5' : '#1e1e1e',
      },
      text: {
        primary: theme === 'light' ? '#333333' : '#ffffff',
        secondary: theme === 'light' ? '#666666' : '#b3b3b3',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 500,
        letterSpacing: '0.5px',
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <SessionProvider>
        <TaskProvider>
          <NoteProvider>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
              <Box sx={{ my: 4, flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 0 }}>
                    Eisenhower Matrix: Prioritise Your Tasks
                  </Typography>
                  <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                    <IconButton onClick={toggleTheme} color="inherit" sx={{ ml: 2 }}>
                      {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Today's Date: {new Date().toLocaleDateString('en-GB')}
                </Typography>
                <SessionSelector />
                <Box sx={{ mb: 4, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    How to Use the Eisenhower Matrix
                  </Typography>
                  <Typography variant="body1" paragraph>
                    The Eisenhower Matrix is a powerful tool for prioritising tasks based on their urgency and importance. Here's how to use it:
                  </Typography>
                  <Typography variant="body2" component="div">
                    • <strong>Urgent & Important (Do First)</strong>: Tasks that need immediate attention and have significant impact. Example: Deadline-driven projects, crises.
                    <br/>
                    • <strong>Important, Not Urgent (Schedule)</strong>: Tasks that matter but don't require immediate action. Example: Long-term planning, skill development.
                    <br/>
                    • <strong>Urgent, Not Important (Delegate)</strong>: Tasks that need swift action but have less impact. Example: Some meetings, certain emails.
                    <br/>
                    • <strong>Not Urgent, Not Important (Eliminate)</strong>: Tasks with little value that don't need swift action. Example: Time-wasting activities, distractions.
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Organise tasks based on urgency and importance to maximise productivity
                </Typography>
                <TaskMatrix />
              </Box>
              <Footer />
            </Container>
          </NoteProvider>
        </TaskProvider>
      </SessionProvider>
    </MuiThemeProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
