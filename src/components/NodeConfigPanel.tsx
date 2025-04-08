import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Chip,
  Grid,
  Radio,
  RadioGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import CallIcon from '@mui/icons-material/Call';
import DialpadIcon from '@mui/icons-material/Dialpad';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StopIcon from '@mui/icons-material/Stop';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import MessageIcon from '@mui/icons-material/Message';

interface NodeConfigPanelProps {
  node: Node;
  updateNodeData: (nodeId: string, newData: any) => void;
  onClose: () => void;
}

interface Option {
  id: string;
  text: string;
}

interface DataField {
  id: string;
  name: string;
  type: string;
}

interface Transition {
  id: string;
  text: string;
}

const dataFieldTypes = ['text', 'number', 'email', 'phone', 'date', 'address'];
const transferTypes = ['Agent', 'Department', 'External', 'Voicemail'];
const endingTypes = ['Hangup', 'Disconnect', 'Transfer', 'Voicemail'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({
  node,
  updateNodeData,
  onClose,
}) => {
  // Common state
  const [message, setMessage] = useState<string>(
    node.data?.message || ''
  );
  const [label, setLabel] = useState<string>(
    node.data?.label || ''
  );

  // Options node state
  const [options, setOptions] = useState<Option[]>(
    node.data?.options || []
  );
  const [newOption, setNewOption] = useState<string>('');

  // Data Request node state
  const [dataFields, setDataFields] = useState<DataField[]>(
    node.data?.dataFields || []
  );
  const [newFieldName, setNewFieldName] = useState<string>('');
  const [newFieldType, setNewFieldType] = useState<string>('text');

  // Conversation node state
  const [transitions, setTransitions] = useState<Transition[]>(
    node.data?.transitions || []
  );
  const [newTransition, setNewTransition] = useState<string>('');

  // Function node state (now simplified as Connect node)
  const [systemName, setSystemName] = useState<string>(
    node.data?.systemName || ''
  );
  const [notes, setNotes] = useState<string>(
    node.data?.notes || ''
  );
  const [systemType, setSystemType] = useState<string>(
    node.data?.systemType || 'CRM'
  );

  
  // Call Transfer node state
  const [transferType, setTransferType] = useState<string>(
    node.data?.transferType || 'Agent'
  );
  const [destination, setDestination] = useState<string>(
    node.data?.destination || ''
  );
  
  // Press Digit node state
  const [prompt, setPrompt] = useState<string>(
    node.data?.prompt || ''
  );
  const [activeDigits, setActiveDigits] = useState<string[]>(
    node.data?.activeDigits || []
  );
  
  // Logic Split node state
  const [condition, setCondition] = useState<string>(
    node.data?.condition || ''
  );
  
  // Ending node state
  const [endType, setEndType] = useState<string>(
    node.data?.endType || 'Hangup'
  );

  useEffect(() => {
    // Common data
    setMessage(node.data?.message || '');
    setLabel(node.data?.label || '');
    
    // Node-specific data
    if (node.type === 'options') {
      setOptions(node.data?.options || []);
    } else if (node.type === 'dataRequest') {
      setDataFields(node.data?.dataFields || []);
    } else if (node.type === 'conversation') {
      setTransitions(node.data?.transitions || []);
    } else if (node.type === 'function') {
      setSystemName(node.data?.systemName || '');
      setNotes(node.data?.notes || '');
      setSystemType(node.data?.systemType || 'CRM');
    } else if (node.type === 'callTransfer') {
      setTransferType(node.data?.transferType || 'Agent');
      setDestination(node.data?.destination || '');
    } else if (node.type === 'pressDigit') {
      setPrompt(node.data?.prompt || '');
      setActiveDigits(node.data?.activeDigits || []);
    } else if (node.type === 'logicSplit') {
      setCondition(node.data?.condition || '');
    } else if (node.type === 'ending') {
      setEndType(node.data?.endType || 'Hangup');
    }
  }, [node]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSave = () => {
    // Start with common data
    const newData: any = { 
      label,
      message
    };
    
    // Update node data based on node type
    let updatedData = {};
    
    if (node.type === 'options') {
      updatedData = { label, options };
    } else if (node.type === 'dataRequest') {
      updatedData = { label, dataFields };
    } else if (node.type === 'conversation') {
      updatedData = { label, message, transitions };
    } else if (node.type === 'function') {
      updatedData = { label, systemName, notes, systemType };
    } else if (node.type === 'callTransfer') {
      newData.transferType = transferType;
      newData.destination = destination;
    } else if (node.type === 'pressDigit') {
      newData.prompt = prompt;
      newData.activeDigits = activeDigits;
    } else if (node.type === 'logicSplit') {
      newData.condition = condition;
    } else if (node.type === 'ending') {
      newData.endType = endType;
    } else if (node.type === 'begin') {
      // Begin node only needs the label
      newData.label = 'Begin';
      delete newData.message;
    }
    
    updateNodeData(node.id, newData);
  };

  const addOption = () => {
    if (newOption.trim() === '') return;
    
    const newOptionObj: Option = {
      id: uuidv4(),
      text: newOption
    };
    
    setOptions([...options, newOptionObj]);
    setNewOption('');
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  const addDataField = () => {
    if (newFieldName.trim() === '') return;
    
    const newField: DataField = {
      id: uuidv4(),
      name: newFieldName,
      type: newFieldType,
    };
    
    setDataFields([...dataFields, newField]);
    setNewFieldName('');
    setNewFieldType('text');
  };

  const removeDataField = (id: string) => {
    setDataFields(dataFields.filter(field => field.id !== id));
  };

  // Conversation node helpers
  const addTransition = () => {
    if (newTransition.trim() === '') return;
    
    const newTransitionObj: Transition = {
      id: uuidv4(),
      text: newTransition
    };
    
    setTransitions([...transitions, newTransitionObj]);
    setNewTransition('');
  };

  const removeTransition = (id: string) => {
    setTransitions(transitions.filter(transition => transition.id !== id));
  };

  // Press Digit node helpers
  const toggleDigit = (digit: string) => {
    if (activeDigits.includes(digit)) {
      setActiveDigits(activeDigits.filter(d => d !== digit));
    } else {
      setActiveDigits([...activeDigits, digit]);
    }
  };

  return (
    <Paper 
      className="config-panel"
      elevation={3}
      sx={{
        position: 'fixed',
        right: 0,
        top: 64,
        width: 320,
        height: 'calc(100vh - 64px)',
        zIndex: 10,
        overflowY: 'auto',
        p: 3,
        boxSizing: 'border-box',
      }}
    >
      <Box className="config-panel-header">
        <Typography variant="h6">
          Edit {(() => {
            switch(node.type) {
              case 'conversation': return 'Conversation';
              case 'function': return 'Function';
              case 'callTransfer': return 'Call Transfer';
              case 'pressDigit': return 'Press Digit';
              case 'logicSplit': return 'Logic Split';
              case 'ending': return 'Ending';
              case 'begin': return 'Begin';
              case 'options': return 'Message + Options';
              case 'dataRequest': return 'Data Request';
              case 'message': return 'Message';
              default: return node.type.charAt(0).toUpperCase() + node.type.slice(1);
            }
          })()} Node
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Node ID: {node.id}
      </Typography>

      {/* Common fields for most nodes */}
      {node.type !== 'begin' && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      
      {/* Message field for nodes that need it */}
      {node.type !== 'begin' && 
       node.type !== 'function' && 
       node.type !== 'logicSplit' && (
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Message"
            value={message}
            onChange={handleMessageChange}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      
      {/* Options node */}
      {node.type === 'options' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Options
          </Typography>
          
          <List dense sx={{ mb: 2 }}>
            {options.map((option) => (
              <ListItem
                key={option.id}
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText 
                  primary={option.text}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeOption(option.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="New Option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addOption();
                }
              }}
            />
            <IconButton 
              onClick={addOption} 
              color="primary"
              sx={{ ml: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      
      {/* Data Request node */}
      {node.type === 'dataRequest' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Data Fields
          </Typography>
          
          <List dense sx={{ mb: 2 }}>
            {dataFields.map((field) => (
              <ListItem
                key={field.id}
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText 
                  primary={field.name}
                  secondary={`Type: ${field.type}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeDataField(field.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <TextField
              label="Field Name"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              sx={{ mb: 1 }}
            />
            
            <FormControl fullWidth size="small" sx={{ mb: 1 }}>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={newFieldType}
                label="Field Type"
                onChange={(e) => setNewFieldType(e.target.value)}
              >
                {dataFieldTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={addDataField}
              fullWidth
            >
              Add Field
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Conversation node */}
      {node.type === 'conversation' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Transitions
          </Typography>
          
          <List dense sx={{ mb: 2 }}>
            {transitions.map((transition) => (
              <ListItem
                key={transition.id}
                sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemText 
                  primary={transition.text}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => removeTransition(transition.id)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="New Transition"
              value={newTransition}
              onChange={(e) => setNewTransition(e.target.value)}
              size="small"
              fullWidth
              variant="outlined"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addTransition();
                }
              }}
            />
            <IconButton 
              onClick={addTransition} 
              color="primary"
              sx={{ ml: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      )}
      
      {/* Function node */}
      {node.type === 'function' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Connect to External System
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This node connects your call flow to your external business systems.
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>System Type</InputLabel>
            <Select
              value={systemType}
              onChange={(e) => setSystemType(e.target.value)}
              label="System Type"
            >
              <MenuItem value="CRM">CRM (Customer Relationship Management)</MenuItem>
              <MenuItem value="Helpdesk">Helpdesk System</MenuItem>
              <MenuItem value="Database">Customer Database</MenuItem>
              <MenuItem value="Google Drive">Google Drive</MenuItem>
              <MenuItem value="Email">Email System</MenuItem>
              <MenuItem value="Calendar">Calendar System</MenuItem>
              <MenuItem value="Other">Other External System</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="System Name"
            placeholder="Enter a name for this system (e.g. Salesforce, Zendesk)"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Add any notes about what you want to do with this system:
          </Typography>
          
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            placeholder="Example: Look up customer information, Create a new support ticket, etc."
          />
        </Box>
      )}
      
      {/* Call Transfer node */}
      {node.type === 'callTransfer' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Transfer Details
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Transfer Type</InputLabel>
            <Select
              value={transferType}
              label="Transfer Type"
              onChange={(e) => setTransferType(e.target.value)}
            >
              {transferTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            label="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      
      {/* Press Digit node */}
      {node.type === 'pressDigit' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Prompt
          </Typography>
          
          <TextField
            label="Prompt Message"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            multiline
            rows={2}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
            Active Digits
          </Typography>
          
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            Select the digits that will have connection points
          </Typography>
          
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {digits.map((digit) => (
              <Grid item xs={4} key={digit}>
                <Box
                  sx={{
                    width: '100%',
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: activeDigits.includes(digit) ? '#9c27b0' : '#e0e0e0',
                    borderRadius: 1,
                    bgcolor: activeDigits.includes(digit) ? '#f3e5f5' : 'transparent',
                    fontWeight: activeDigits.includes(digit) ? 'bold' : 'normal',
                    color: activeDigits.includes(digit) ? '#9c27b0' : 'text.primary',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleDigit(digit)}
                >
                  {digit}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Logic Split node */}
      {node.type === 'logicSplit' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            If/Then Decision
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create a decision point in your call flow. If the condition is true, follow the THEN path, otherwise follow the ELSE path.
          </Typography>
          
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
            <InputLabel>Choose a condition type</InputLabel>
            <Select
              value={condition ? 'custom' : 'select'}
              onChange={(e) => {
                if (e.target.value === 'select') {
                  setCondition('');
                }
              }}
              label="Choose a condition type"
            >
              <MenuItem value="select">Select from common conditions</MenuItem>
              <MenuItem value="custom">Write my own condition</MenuItem>
            </Select>
          </FormControl>
          
          {condition ? (
            <TextField
              label="IF this condition is true"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              multiline
              rows={2}
              fullWidth
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              placeholder="Example: caller is a customer"
              helperText="Describe what condition should be checked"
            />
          ) : (
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Common conditions</InputLabel>
              <Select
                value=""
                onChange={(e) => setCondition(e.target.value)}
                label="Common conditions"
              >
                <MenuItem value="Caller is a customer">Caller is a customer</MenuItem>
                <MenuItem value="Caller has an account">Caller has an account</MenuItem>
                <MenuItem value="Caller wants to speak to an agent">Caller wants to speak to an agent</MenuItem>
                <MenuItem value="Business hours">During business hours</MenuItem>
                <MenuItem value="Caller is from a specific region">Caller is from a specific region</MenuItem>
                <MenuItem value="High call volume">High call volume</MenuItem>
              </Select>
            </FormControl>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#e8f5e9', 
              borderRadius: 1, 
              width: '45%',
              textAlign: 'center',
              border: '1px solid #81c784'
            }}>
              <Typography sx={{ fontWeight: 'medium', color: '#2e7d32' }}>
                THEN
              </Typography>
              <Typography variant="caption" color="text.secondary">
                If condition is true
              </Typography>
            </Box>
            
            <Box sx={{ 
              p: 2, 
              bgcolor: '#ffebee', 
              borderRadius: 1, 
              width: '45%',
              textAlign: 'center',
              border: '1px solid #e57373'
            }}>
              <Typography sx={{ fontWeight: 'medium', color: '#c62828' }}>
                ELSE
              </Typography>
              <Typography variant="caption" color="text.secondary">
                If condition is false
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Ending node */}
      {node.type === 'ending' && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            End Type
          </Typography>
          
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <RadioGroup
              value={endType}
              onChange={(e) => setEndType(e.target.value)}
            >
              {endingTypes.map((type) => (
                <FormControlLabel 
                  key={type} 
                  value={type} 
                  control={<Radio />} 
                  label={type} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default NodeConfigPanel;
