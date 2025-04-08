import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CodeIcon from '@mui/icons-material/Code';
import CallIcon from '@mui/icons-material/Call';
import DialpadIcon from '@mui/icons-material/Dialpad';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StopIcon from '@mui/icons-material/Stop';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ open, onClose, onStartTour }) => {
  const nodeTypes = [
    {
      name: 'Begin',
      icon: <PlayCircleFilledIcon sx={{ fontSize: 40, color: '#5e35b1' }} />,
      description: 'The starting point of your call flow. Every flow must have a Begin node.'
    },
    {
      name: 'Conversation',
      icon: <ChatIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      description: 'Add conversational elements like greetings, questions, and responses.'
    },
    {
      name: 'Connect',
      icon: <CodeIcon sx={{ fontSize: 40, color: '#00897b' }} />,
      description: 'Connect to external systems like your CRM or helpdesk.'
    },
    {
      name: 'Call Transfer',
      icon: <CallIcon sx={{ fontSize: 40, color: '#43a047' }} />,
      description: 'Transfer the call to another department or person.'
    },
    {
      name: 'Press Digit',
      icon: <DialpadIcon sx={{ fontSize: 40, color: '#fb8c00' }} />,
      description: 'Allow callers to make choices by pressing digits on their keypad.'
    },
    {
      name: 'If/Then Split',
      icon: <AccountTreeIcon sx={{ fontSize: 40, color: '#3949ab' }} />,
      description: 'Create decision points in your call flow based on conditions.'
    },
    {
      name: 'Ending',
      icon: <StopIcon sx={{ fontSize: 40, color: '#e53935' }} />,
      description: 'End the call flow. You can have multiple ending points.'
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Typography variant="h4" component="div" align="center" fontWeight="bold">
          Welcome to Talk Small Business Call Builder
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h5" gutterBottom align="center" fontWeight="medium" color="primary">
            Build Your Call Flow Like Legos
          </Typography>
          <Typography variant="body1" paragraph align="center">
            Create professional voice call flows for your business in minutes, no technical skills required.
            Just drag, drop, and connect the building blocks to design your perfect customer experience.
          </Typography>
        </Box>
        
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary.dark">
          Your Building Blocks:
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {nodeTypes.map((node) => (
            <Grid item xs={12} sm={6} md={4} key={node.name}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  {node.icon}
                  <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                    {node.name}
                  </Typography>
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary">
                    {node.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom color="primary.dark" fontWeight="bold">
            Getting Started in 3 Easy Steps:
          </Typography>
          <ol>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Drag nodes</strong> from the left panel onto the canvas to build your call flow.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Connect nodes</strong> by dragging from one node's handle to another.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph>
                <strong>Configure each node</strong> by clicking on it and using the settings panel.
              </Typography>
            </li>
          </ol>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Skip Tour
        </Button>
        <Button onClick={() => { onStartTour(); onClose(); }} variant="contained" color="primary">
          Start Guided Tour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;
