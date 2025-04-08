import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OrderTracker, { OrderDetails, OrderStatus } from './OrderTracker';

interface OrderTrackingPageProps {
  isAdmin: boolean;
  onBack: () => void;
  currentFlowId?: string;
  currentFlowName?: string;
}

const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ 
  isAdmin, 
  onBack, 
  currentFlowId,
  currentFlowName
}) => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('callFlowOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      setOrders(parsedOrders);
      
      // If we have a current flow ID, select that order
      if (currentFlowId) {
        const currentOrder = parsedOrders.find((order: OrderDetails) => order.id === currentFlowId);
        if (currentOrder) {
          setSelectedOrder(currentOrder);
        }
      } else if (parsedOrders.length > 0) {
        // Otherwise select the most recent order
        setSelectedOrder(parsedOrders[0]);
      }
    }
  }, [currentFlowId]);

  // Handle updating an order's status
  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    localStorage.setItem('callFlowOrders', JSON.stringify(updatedOrders));
    
    // Update the selected order if it's the one being modified
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back to Builder
        </Button>
        <Typography variant="h4" component="h1">
          Call Flow Order Tracking
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No orders found</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Submit a call flow to see its progress here.
          </Typography>
        </Paper>
      ) : (
        <Box display="flex" gap={4}>
          {/* Order list sidebar */}
          <Paper sx={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
            <List>
              <ListItem sx={{ bgcolor: 'primary.main', color: 'white' }}>
                <ListItemText 
                  primary="Your Orders" 
                  primaryTypographyProps={{ fontWeight: 'bold' }} 
                />
              </ListItem>
              <Divider />
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem 
                    button 
                    selected={selectedOrder?.id === order.id}
                    onClick={() => setSelectedOrder(order)}
                    sx={{ 
                      '&.Mui-selected': { 
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      }
                    }}
                  >
                    <ListItemText
                      primary={order.flowName}
                      secondary={`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}
                      primaryTypographyProps={{ fontWeight: selectedOrder?.id === order.id ? 'bold' : 'normal' }}
                      secondaryTypographyProps={{ 
                        color: selectedOrder?.id === order.id ? 'inherit' : 'text.secondary'
                      }}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Order tracker */}
          <Box sx={{ flexGrow: 1 }}>
            {selectedOrder && (
              <OrderTracker 
                order={{
                  ...selectedOrder,
                  dateSubmitted: formatDate(selectedOrder.dateSubmitted)
                }}
                isAdmin={isAdmin}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default OrderTrackingPage;
