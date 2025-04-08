import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import Confetti from 'react-confetti';
import { v4 as uuidv4 } from 'uuid';
import { OrderDetails } from './OrderTracker';

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  flowName: string;
  onPublish: (orderId: string) => void;
}

const PublishDialog: React.FC<PublishDialogProps> = ({ 
  open, 
  onClose, 
  flowName,
  onPublish
}) => {
  const [notes, setNotes] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setNotes('');
      setShowConfetti(false);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [open]);

  const handlePublish = () => {
    setIsSubmitting(true);
    
    // Create a new order
    const orderId = uuidv4();
    const newOrder: OrderDetails = {
      id: orderId,
      flowName,
      dateSubmitted: new Date().toISOString(),
      status: 'ordered',
      notes: notes || undefined,
      estimatedCompletion: getEstimatedCompletionDate()
    };
    
    // Get existing orders or initialize empty array
    const existingOrdersString = localStorage.getItem('callFlowOrders');
    const existingOrders = existingOrdersString ? JSON.parse(existingOrdersString) : [];
    
    // Add new order to the beginning of the array
    const updatedOrders = [newOrder, ...existingOrders];
    
    // Save to localStorage
    localStorage.setItem('callFlowOrders', JSON.stringify(updatedOrders));
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setShowConfetti(true);
      
      // Call the onPublish callback with the order ID
      onPublish(orderId);
      
      // Auto-close after confetti
      setTimeout(() => {
        onClose();
      }, 5000);
    }, 1500);
  };
  
  // Calculate an estimated completion date (7-10 days from now)
  const getEstimatedCompletionDate = () => {
    const today = new Date();
    const daysToAdd = 7 + Math.floor(Math.random() * 4); // 7-10 days
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + daysToAdd);
    
    return estimatedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}
      
      <DialogTitle>
        {isSuccess ? "Congratulations!" : "Publish Call Flow"}
      </DialogTitle>
      
      <DialogContent>
        {isSubmitting ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={4}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Submitting your call flow...
            </Typography>
          </Box>
        ) : isSuccess ? (
          <Box py={2}>
            <Typography variant="h6" gutterBottom color="primary">
              Your call flow has been submitted for development!
            </Typography>
            <Typography variant="body1" paragraph>
              Our team will begin working on implementing your call flow design. You can track the progress of your order in the Order Tracking page.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {uuidv4().substring(0, 8)}
            </Typography>
          </Box>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              You're about to submit "{flowName}" for development by our team. Once submitted, our developers will implement your call flow design and keep you updated on the progress.
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estimated completion time: 7-10 business days
            </Typography>
            
            <TextField
              label="Additional Notes (Optional)"
              multiline
              rows={4}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions or requirements for our development team..."
              margin="normal"
            />
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        {!isSubmitting && !isSuccess && (
          <>
            <Button onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublish} 
              variant="contained" 
              disabled={isSubmitting}
              sx={{ bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' }, color: 'white' }}
            >
              Submit for Development
            </Button>
          </>
        )}
        {isSuccess && (
          <Button 
            onClick={onClose} 
            variant="contained" 
            sx={{ bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' }, color: 'white' }}
          >
            View Order Status
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PublishDialog;
