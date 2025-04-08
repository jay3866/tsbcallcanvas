import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Backdrop,
  Fade,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Node type icons
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MessageIcon from '@mui/icons-material/Message';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import StopIcon from '@mui/icons-material/Stop';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CallIcon from '@mui/icons-material/Call';
import DialpadIcon from '@mui/icons-material/Dialpad';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Using placeholder images instead of actual imports since the files are empty
const beginNodeImg = '';
const conversationNodeImg = '';
const ifThenNodeImg = '';
const connectNodeImg = '';
const transferNodeImg = '';
const pressDigitNodeImg = '';
const endingNodeImg = '';

// Define the node types with their descriptions and icons
const nodeTypes = [
  {
    id: 'begin',
    name: 'Begin Node',
    description: 'The starting point of your call flow. Every flow must have one Begin node.',
    icon: <PlayCircleFilledIcon sx={{ fontSize: 40, color: '#4caf50' }} />,
    image: beginNodeImg,
    color: '#4caf50'
  },
  {
    id: 'conversation',
    name: 'Conversation Node',
    description: 'Used for messages that will be spoken to the caller. Add transitions to capture different caller responses.',
    icon: <MessageIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    image: conversationNodeImg,
    color: '#2196f3'
  },
  {
    id: 'logicSplit',
    name: 'If/Then Split',
    description: 'Creates a decision point in your call flow based on conditions. One path for when the condition is true, another for when it\'s false.',
    icon: <CallSplitIcon sx={{ fontSize: 40, color: '#2196f3' }} />,
    image: ifThenNodeImg,
    color: '#2196f3'
  },
  {
    id: 'function',
    name: 'Connect Node',
    description: 'Connects your call flow to external systems like your CRM, helpdesk, or other business tools.',
    icon: <SystemUpdateAltIcon sx={{ fontSize: 40, color: '#ff9800' }} />,
    image: connectNodeImg,
    color: '#ff9800'
  },
  {
    id: 'callTransfer',
    name: 'Call Transfer',
    description: 'Transfers the call to an agent, department, or external number.',
    icon: <CallIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
    image: transferNodeImg,
    color: '#9c27b0'
  },
  {
    id: 'pressDigit',
    name: 'Press Digit',
    description: 'Creates a menu where callers can press digits on their keypad to navigate different paths.',
    icon: <DialpadIcon sx={{ fontSize: 40, color: '#9c27b0' }} />,
    image: pressDigitNodeImg,
    color: '#9c27b0'
  },
  {
    id: 'ending',
    name: 'Ending Node',
    description: 'Ends the call flow. You can configure different ending types like hangup, transfer, or voicemail.',
    icon: <StopIcon sx={{ fontSize: 40, color: '#f44336' }} />,
    image: endingNodeImg,
    color: '#f44336'
  }
];

// Getting started steps
const gettingStartedSteps = [
  {
    label: 'Add your first node',
    description: 'Drag a Begin node from the left panel onto the canvas to start your call flow.',
    icon: <AddCircleIcon color="primary" />
  },
  {
    label: 'Connect nodes together',
    description: 'Connect nodes by clicking and dragging from one node\'s output handle to another node\'s input handle.',
    icon: <DragIndicatorIcon color="primary" />
  },
  {
    label: 'Configure your nodes',
    description: 'Click on any node to open its configuration panel and customize its behavior.',
    icon: <TouchAppIcon color="primary" />
  }
];

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
  startTour?: () => void;
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrev?: () => void;
  title?: string;
  content?: React.ReactNode;
  targetElement?: string;
}

const OnboardingTour: React.FC<OnboardingTourProps> = (props) => {
  const { 
    open, 
    onClose, 
    startTour,
    currentStep,
    totalSteps,
    onNext,
    onPrev,
    title,
    content,
    targetElement
  } = props;
  
  // If we have currentStep, we're in guided tour mode, otherwise we're in welcome mode
  const isGuidedTour = currentStep !== undefined;
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStartTour = () => {
    onClose();
    startTour();
  };

  // If in guided tour mode, render the guided tour overlay
  if (isGuidedTour && currentStep && totalSteps && onNext && onPrev && title && content) {
    return <GuidedTour 
      open={open}
      onClose={onClose}
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrev={onPrev}
      title={title}
      content={content}
      targetElement={targetElement}
    />;
  }
  
  // Otherwise render the welcome dialog
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#0a2472', color: 'white' }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          Welcome to Talk Small Business - Call Builder
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
            Build Your Call Flow Like Building with Blocks
          </Typography>
          <Typography variant="body1" paragraph>
            Our call builder makes it easy to create professional voice call flows for your small business.
            Think of each node as a building block that you can connect together to create your perfect customer experience.
          </Typography>

          {activeStep === 0 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Your Building Blocks
              </Typography>
              <Typography variant="body2" paragraph color="text.secondary">
                Each node type serves a specific purpose in your call flow. Drag them from the left panel onto the canvas.
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {nodeTypes.map((node) => (
                  <Grid item xs={12} sm={6} md={4} key={node.id}>
                    <Card elevation={2} sx={{ height: '100%', borderLeft: `4px solid ${node.color}` }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {node.icon}
                          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
                            {node.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {node.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Getting Started in 3 Easy Steps
              </Typography>
              
              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                {gettingStartedSteps.map((step, index) => (
                  <Step key={step.label} active={true}>
                    <StepLabel StepIconComponent={() => 
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }}>
                        {step.icon}
                      </Box>
                    }>
                      <Typography variant="subtitle1">{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">{step.description}</Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              
              <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f9ff', borderRadius: 2, border: '1px dashed #2196f3' }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon color="primary" sx={{ mr: 1 }} />
                  <strong>Pro Tip:</strong> Start simple with a Begin node connected to a Conversation node, then gradually add more complexity.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Box>
          {activeStep > 0 && (
            <Button onClick={handleBack} startIcon={<NavigateBeforeIcon />}>
              Back
            </Button>
          )}
        </Box>
        
        <Box>
          {activeStep < 1 ? (
            <Button onClick={handleNext} variant="contained" color="primary" endIcon={<NavigateNextIcon />}>
              Next
            </Button>
          ) : (
            <Button onClick={handleStartTour} variant="contained" color="primary" endIcon={<PlayArrowIcon />}>
              Start Interactive Tour
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

interface GuidedTourProps {
  open: boolean;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  title: string;
  content: React.ReactNode;
  targetElement?: string;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  open,
  onClose,
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  title,
  content,
  targetElement
}) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  useEffect(() => {
    if (targetElement && open) {
      // Add a highlight class to the target element
      const elements = document.querySelectorAll(targetElement);
      if (elements && elements.length > 0) {
        // Use the first element for positioning if there are multiple matches
        const rect = elements[0].getBoundingClientRect();
        setTargetRect(rect);
        
        // Add highlight class to all matching elements
        elements.forEach(el => {
          el.classList.add('tour-highlight');
        });
        
        // Add a style tag for the highlight effect if it doesn't exist
        if (!document.getElementById('tour-highlight-style')) {
          const style = document.createElement('style');
          style.id = 'tour-highlight-style';
          style.innerHTML = `
            .tour-highlight {
              position: relative;
              z-index: 9999 !important;
              animation: pulse 1.5s infinite;
              box-shadow: 0 0 0 10px rgba(33, 150, 243, 0.3) !important;
              border-radius: 4px !important;
            }
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7); }
              70% { box-shadow: 0 0 0 10px rgba(33, 150, 243, 0); }
              100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0); }
            }
          `;
          document.head.appendChild(style);
        }
      }
    }
    
    // Cleanup function
    return () => {
      // Remove highlight class from all elements
      document.querySelectorAll('.tour-highlight').forEach(el => {
        el.classList.remove('tour-highlight');
      });
      
      if (!open) {
        // Remove the style tag when tour is closed
        const styleTag = document.getElementById('tour-highlight-style');
        if (styleTag) {
          styleTag.remove();
        }
        setTargetRect(null);
      }
    };
  }, [targetElement, open, currentStep]);

  if (!open) return null;

  return (
    <>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        open={open}
      />
      
      {targetRect && (
        <Box
          sx={{
            position: 'fixed',
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            border: '3px solid #2196f3',
            borderRadius: 2,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            zIndex: (theme) => theme.zIndex.drawer + 2,
            pointerEvents: 'none',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              border: '2px dashed white',
              borderRadius: 2
            }
          }}
        />
      )}
      
      <Fade in={open}>
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: 500,
            zIndex: (theme) => theme.zIndex.drawer + 3,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ bgcolor: '#0a2472', color: 'white', px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              {title}
            </Typography>
            <Typography variant="body2">
              {currentStep} of {totalSteps}
            </Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {content}
          </Box>
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5 }}>
            <Box>
              {currentStep > 1 && (
                <Button onClick={onPrev} startIcon={<NavigateBeforeIcon />} size="small">
                  Previous
                </Button>
              )}
            </Box>
            
            <Box>
              <Button onClick={onClose} color="inherit" size="small" sx={{ mr: 1 }}>
                Skip Tour
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={onNext} variant="contained" color="primary" endIcon={<NavigateNextIcon />} size="small">
                  Next
                </Button>
              ) : (
                <Button onClick={onClose} variant="contained" color="success" endIcon={<CheckCircleIcon />} size="small">
                  Finish
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};

export default OnboardingTour;
