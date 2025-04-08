import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { OrderDetails, OrderStatus } from './OrderTracker';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dev-tabpanel-${index}`}
      aria-labelledby={`dev-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface DeveloperPanelProps {
  open: boolean;
  onClose: () => void;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({ open, onClose }) => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('ordered');
  const [notes, setNotes] = useState('');
  const [estimatedCompletion, setEstimatedCompletion] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Load orders from localStorage on component mount
  useEffect(() => {
    if (open) {
      loadOrders();
    }
  }, [open]);

  const loadOrders = () => {
    const storedOrders = localStorage.getItem('callFlowOrders');
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      setOrders(parsedOrders);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setNewStatus(event.target.value as OrderStatus);
  };

  const handleUpdateOrder = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return { 
          ...order, 
          status: newStatus,
          notes: notes || order.notes,
          estimatedCompletion: estimatedCompletion || order.estimatedCompletion
        };
      }
      return order;
    });
    
    // Save to localStorage
    localStorage.setItem('callFlowOrders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    setUpdateDialogOpen(false);
    
    // Update selected order
    const updatedOrder = updatedOrders.find(order => order.id === selectedOrder.id);
    if (updatedOrder) {
      setSelectedOrder(updatedOrder);
    }
  };

  const openUpdateDialog = (order: OrderDetails) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNotes(order.notes || '');
    setEstimatedCompletion(order.estimatedCompletion || '');
    setUpdateDialogOpen(true);
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

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'ordered': return '#ff9800';
      case 'development': return '#2196f3';
      case 'testing': return '#9c27b0';
      case 'review': return '#ff5722';
      case 'ready': return '#4caf50';
      default: return '#757575';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: '#0a2472', color: 'white' }}>
        Developer Admin Panel
      </DialogTitle>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="developer panel tabs">
          <Tab label="Order Management" />
          <Tab label="Export Tools" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          Manage Customer Orders
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Flow Name</TableCell>
                <TableCell>Date Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Est. Completion</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id.substring(0, 8)}</TableCell>
                    <TableCell>{order.flowName}</TableCell>
                    <TableCell>{formatDate(order.dateSubmitted)}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-block', 
                        bgcolor: getStatusColor(order.status), 
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontWeight: 'medium'
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Box>
                    </TableCell>
                    <TableCell>{order.estimatedCompletion || 'Not set'}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => openUpdateDialog(order)}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No orders found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography variant="body2" color="text.secondary">
          * All order data is stored in the browser's localStorage. No database is required.
        </Typography>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Export Tools
        </Typography>
        <Typography variant="body1" paragraph>
          This tab contains tools for exporting call flows to various formats for implementation.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained">Export All Orders</Button>
          <Button variant="contained">Generate Implementation Report</Button>
        </Box>
      </TabPanel>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
      
      {/* Update Order Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {selectedOrder && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Flow: {selectedOrder.flowName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order ID: {selectedOrder.id.substring(0, 8)}
              </Typography>
              
              <FormControl fullWidth margin="normal">
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
              
              <TextField
                label="Estimated Completion Date"
                fullWidth
                margin="normal"
                value={estimatedCompletion}
                onChange={(e) => setEstimatedCompletion(e.target.value)}
                placeholder="e.g., April 15, 2025"
              />
              
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes visible to the customer"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateOrder} variant="contained" color="primary">
            Update Order
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default DeveloperPanel;
