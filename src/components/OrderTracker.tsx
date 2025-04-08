import React from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the order status stages
export type OrderStatus = 'ordered' | 'development' | 'testing' | 'review' | 'ready';

export interface OrderDetails {
  id: string;
  flowName: string;
  dateSubmitted: string;
  status: OrderStatus;
  estimatedCompletion?: string;
  notes?: string;
}

interface OrderTrackerProps {
  order: OrderDetails;
  isAdmin: boolean;
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void;
}

// Custom styled components for the tracker
const TrackerContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
}));

const TrackerHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor: '#0a2472',
  color: 'white',
  padding: theme.spacing(2),
  borderRadius: '8px 8px 0 0',
}));

const ColoredStepper = styled(Stepper)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  backgroundColor: '#f8f9fa',
  borderRadius: 2,
  '& .MuiStepConnector-line': {
    height: 3,
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    backgroundImage: 'linear-gradient(to right, #ff0000, #00968f)',
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    backgroundImage: 'linear-gradient(to right, #ff0000, #00968f)',
  },
}));

// Custom step styling
const CustomStep = styled(Step)<{ status: OrderStatus; currentStatus: OrderStatus }>(({ status, currentStatus, theme }) => {
  const statusOrder: OrderStatus[] = ['ordered', 'development', 'testing', 'review', 'ready'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const stepIndex = statusOrder.indexOf(status);
  
  const isActive = currentIndex === stepIndex;
  const isCompleted = currentIndex > stepIndex;
  
  return {
    '& .MuiStepLabel-root': {
      color: isCompleted || isActive ? '#0099cc' : theme.palette.text.disabled,
    },
    '& .MuiStepLabel-label': {
      color: isCompleted || isActive ? theme.palette.text.primary : theme.palette.text.disabled,
      fontWeight: isActive ? 700 : 400,
    },
    '& .MuiStepIcon-root': {
      color: isCompleted ? '#0099cc' : isActive ? '#ff0000' : theme.palette.grey[300],
    },
    '& .MuiStepIcon-text': {
      fill: isCompleted || isActive ? '#ffffff' : theme.palette.text.primary,
    },
  };
});

const OrderTracker: React.FC<OrderTrackerProps> = ({ order, isAdmin, onStatusUpdate }) => {
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<OrderStatus>(order.status);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value as OrderStatus);
  };

  const handleUpdateStatus = () => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus);
    }
    setUpdateDialogOpen(false);
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'ordered': return 'Ordered';
      case 'development': return 'Development';
      case 'testing': return 'Testing';
      case 'review': return 'Review';
      case 'ready': return 'Ready';
      default: return status;
    }
  };

  const getStatusDescription = (status: OrderStatus): string => {
    switch (status) {
      case 'ordered': return 'Your call flow has been submitted and is in the queue for development.';
      case 'development': return 'Our team is currently building your call flow.';
      case 'testing': return 'Your call flow is being tested to ensure it works correctly.';
      case 'review': return 'Final quality checks are being performed on your call flow.';
      case 'ready': return 'Your call flow is ready to use! Our team will contact you with next steps.';
      default: return '';
    }
  };

  return (
    <TrackerContainer>
      <TrackerHeader>
        <Typography variant="h5" fontWeight="bold">
          CALL FLOW TRACKER
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          TRACK THE PROGRESS OF YOUR CALL FLOW IN REAL TIME
        </Typography>
      </TrackerHeader>

      <Box mb={4}>
        <Typography variant="h6">
          Flow Name: {order.flowName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Submitted: {order.dateSubmitted}
        </Typography>
        {order.estimatedCompletion && (
          <Typography variant="body2" color="textSecondary">
            Estimated Completion: {order.estimatedCompletion}
          </Typography>
        )}
      </Box>

      <ColoredStepper activeStep={
        order.status === 'ordered' ? 0 :
        order.status === 'development' ? 1 :
        order.status === 'testing' ? 2 :
        order.status === 'review' ? 3 : 4
      } alternativeLabel>
        <CustomStep status="ordered" currentStatus={order.status}>
          <StepLabel>Ordered</StepLabel>
        </CustomStep>
        <CustomStep status="development" currentStatus={order.status}>
          <StepLabel>Development</StepLabel>
        </CustomStep>
        <CustomStep status="testing" currentStatus={order.status}>
          <StepLabel>Testing</StepLabel>
        </CustomStep>
        <CustomStep status="review" currentStatus={order.status}>
          <StepLabel>Review</StepLabel>
        </CustomStep>
        <CustomStep status="ready" currentStatus={order.status}>
          <StepLabel>Ready</StepLabel>
        </CustomStep>
      </ColoredStepper>

      <Box mt={4} p={3} bgcolor="#f5f5f5" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Current Status: {getStatusLabel(order.status)}
        </Typography>
        <Typography variant="body1">
          {getStatusDescription(order.status)}
        </Typography>
        {order.notes && (
          <Box mt={2}>
            <Typography variant="subtitle2">Notes:</Typography>
            <Typography variant="body2">{order.notes}</Typography>
          </Box>
        )}
      </Box>

      {isAdmin && (
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            onClick={() => setUpdateDialogOpen(true)}
            sx={{ bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' }, color: 'white' }}
          >
            Update Status
          </Button>
        </Box>
      )}

      {/* Status Update Dialog (Admin only) */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="ordered">Ordered</MenuItem>
              <MenuItem value="development">Development</MenuItem>
              <MenuItem value="testing">Testing</MenuItem>
              <MenuItem value="review">Review</MenuItem>
              <MenuItem value="ready">Ready</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            variant="contained" 
            sx={{ bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' }, color: 'white' }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </TrackerContainer>
  );
};

export default OrderTracker;
