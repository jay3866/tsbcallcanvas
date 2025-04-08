import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  OnConnect,
  NodeMouseHandler,
  Panel,
} from 'reactflow';
import { useAuth } from './supabase/AuthContext';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti';
import { toPng } from 'html-to-image';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import MessageIcon from '@mui/icons-material/Message';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeIcon from '@mui/icons-material/Code';
import CallIcon from '@mui/icons-material/Call';
import DialpadIcon from '@mui/icons-material/Dialpad';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import PublishIcon from '@mui/icons-material/Publish';
import InfoIcon from '@mui/icons-material/Info';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import StopIcon from '@mui/icons-material/Stop';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import MessageNode from './components/MessageNode';
import OptionsNode from './components/OptionsNode';
import DataRequestNode from './components/DataRequestNode';
import NodeConfigPanel from './components/NodeConfigPanel';
import SavedFlowsTable from './components/SavedFlowsTable';
import ExportDialog from './components/ExportDialog';
import OnboardingTour from './components/OnboardingTour';
import OrderTrackingPage from './components/OrderTrackingPage';
import PublishDialog from './components/PublishDialog';
// import WelcomeDialog from './components/WelcomeDialog';
import PasswordDialog from './components/PasswordDialog';
import DeveloperPanel from './components/DeveloperPanel';
import AreaCodeSelector from './components/AreaCodeSelector';

// Import new node types
import ConversationNode from './components/ConversationNode';
import FunctionNode from './components/FunctionNode';
import CallTransferNode from './components/CallTransferNode';
import PressDigitNode from './components/PressDigitNode';
import LogicSplitNode from './components/LogicSplitNode';
import EndingNode from './components/EndingNode';
import BeginNode from './components/BeginNode';

import './App.css';

// Define custom node types
const nodeTypes: NodeTypes = {
  message: MessageNode,
  options: OptionsNode,
  dataRequest: DataRequestNode,
  conversation: ConversationNode,
  function: FunctionNode,
  callTransfer: CallTransferNode,
  pressDigit: PressDigitNode,
  logicSplit: LogicSplitNode,
  ending: EndingNode,
  begin: BeginNode,
};

// Interface for saved flow
interface SavedFlow {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
  data: string; // JSON string of the flow data
  status?: 'draft' | 'published';
  orderId?: string;
}

// Define the theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#00968f', // Blue-green color for publish buttons
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Initial nodes for the flow
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'begin',
    data: { 
      label: 'Begin'
    },
    position: { x: 200, y: 70 },
    style: {
      background: '#673ab7',
      color: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      width: 120,
    },
  },
  {
    id: 'welcome',
    type: 'conversation',
    data: { 
      label: 'Welcome Node',
      message: 'Hello this is customer support department, how can I help you today?',
      transitions: [
        { id: '1', text: 'User needs to return the package' },
        { id: '2', text: 'User needs to check the order status' }
      ]
    },
    position: { x: 350, y: 70 },
    style: {
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      width: 220,
    },
  },





];

// Initial edges for the flow
const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'start', target: 'welcome' },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [drawerOpen] = useState(true);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [flowName, setFlowName] = useState('My Flow');
  const [savedFlows, setSavedFlows] = useState<SavedFlow[]>([]);
  const [savedFlowsOpen, setSavedFlowsOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [createNewFlowDialogOpen, setCreateNewFlowDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | undefined>();
  const [developerPanelOpen, setDeveloperPanelOpen] = useState(false);
  const [showAreaCodeSelector, setShowAreaCodeSelector] = useState(false);
  
  // Onboarding state
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [guidedTourOpen, setGuidedTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const totalTourSteps = 8;
  const [isAdmin, setIsAdmin] = useState(false); // Total number of steps in the guided tour
  
  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Load saved flows from localStorage and check if first visit
  React.useEffect(() => {
    const savedFlowsData = localStorage.getItem('savedFlows');
    if (savedFlowsData) {
      setSavedFlows(JSON.parse(savedFlowsData));
    }
    
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      // Show welcome dialog on first visit
      setWelcomeDialogOpen(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setConfigPanelOpen(true);
  }, []);

  // Add a new node to the flow
  const addNode = (type: string) => {
    let nodeData: any = { label: '' };
    let nodeStyle: any = {
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      width: 220,
    };
    
    // Set specific data and styles based on node type
    switch (type) {
      case 'conversation':
        nodeData = {
          label: 'Conversation',
          message: 'Enter your conversation message here',
          transitions: []
        };
        break;
      case 'function':
        nodeData = {
          label: 'Function',
          functionName: 'myFunction',
          parameters: '{}'
        };
        nodeStyle.borderLeft = '4px solid #ff9800';
        break;
      case 'callTransfer':
        nodeData = {
          label: 'Call Transfer',
          transferType: 'Agent',
          destination: 'Support Team'
        };
        nodeStyle.borderLeft = '4px solid #4caf50';
        break;
      case 'pressDigit':
        nodeData = {
          label: 'Press Digit',
          prompt: 'Please press a digit to continue',
          activeDigits: ['1', '2', '3']
        };
        nodeStyle.borderLeft = '4px solid #9c27b0';
        break;
      case 'logicSplit':
        nodeData = {
          label: 'Logic Split Node',
          condition: 'user.hasAccount === true'
        };
        nodeStyle.borderLeft = '4px solid #2196f3';
        break;
      case 'ending':
        nodeData = {
          label: 'Ending',
          message: 'Thank you for calling. Goodbye!',
          endType: 'Hangup'
        };
        nodeStyle.borderLeft = '4px solid #f44336';
        break;
      case 'begin':
        nodeData = { label: 'Begin' };
        nodeStyle = {
          background: '#673ab7',
          color: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          width: 120,
        };
        break;
      case 'message':
        nodeData = {
          label: 'Message',
          message: 'New message'
        };
        break;
      case 'options':
        nodeData = {
          label: 'Options',
          message: 'Select an option',
          options: []
        };
        break;
      case 'dataRequest':
        nodeData = {
          label: 'Data Request',
          message: 'Please provide the following information',
          dataFields: []
        };
        break;
      default:
        nodeData = {
          label: type.charAt(0).toUpperCase() + type.slice(1),
          message: ''
        };
    }
    
    const newNode: Node = {
      id: uuidv4(),
      type,
      data: nodeData,
      position: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50,
      },
      style: nodeStyle,
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // Update node data
  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );
  };

  // Delete selected node
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => 
        eds.filter(
          (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      setConfigPanelOpen(false);
    }
  };

  // Take a screenshot of the flow
  const takeScreenshot = () => {
    if (reactFlowWrapper.current === null) {
      return Promise.reject('No flow wrapper found');
    }
    
    const flowElement = reactFlowWrapper.current.querySelector('.react-flow__viewport');
    if (flowElement === null) {
      return Promise.reject('No flow element found');
    }
    
    return toPng(flowElement as HTMLElement, {
      backgroundColor: '#f5f5f5',
      width: flowElement.scrollWidth,
      height: flowElement.scrollHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      }
    });
  };

  // Save the flow
  const saveFlow = () => {
    // Take a screenshot of the flow
    takeScreenshot().then((dataUrl) => {
      if (!dataUrl) return;
      
      // Generate a unique ID
      const id = uuidv4();
      
      // Create a new saved flow object
      const newFlow: SavedFlow = {
        id,
        name: flowName,
        date: new Date().toLocaleString(),
        thumbnail: dataUrl,
        data: JSON.stringify({ nodes, edges, flowName }),
        status: 'draft'
      };
      
      // Add to saved flows
      const updatedFlows = [newFlow, ...savedFlows];
      setSavedFlows(updatedFlows);
      
      // Save to localStorage
      localStorage.setItem('savedFlows', JSON.stringify(updatedFlows));
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    });
  };

  // Load the flow
  const loadFlow = (flowData?: string) => {
    try {
      const data = flowData || localStorage.getItem('callFlow');
      if (data) {
        const flow = JSON.parse(data);
        setNodes(flow.nodes);
        setEdges(flow.edges);
      }
    } catch (error) {
      console.error('Error loading flow:', error);
      alert('Could not load the flow. The data may be corrupted.');
    }
  };
  
  // Delete a saved flow
  const deleteSavedFlow = (id: string) => {
    const updatedFlows = savedFlows.filter(flow => flow.id !== id);
    setSavedFlows(updatedFlows);
    localStorage.setItem('savedFlows', JSON.stringify(updatedFlows));
  };
  
  // Open saved flows dialog
  const openSavedFlows = () => {
    setSavedFlowsOpen(true);
  };

  // Open password dialog for developer access
  const openPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  // Function to handle password verification
  const handlePasswordCorrect = () => {
    setPasswordDialogOpen(false);
    setDeveloperPanelOpen(true);
    setIsAdmin(true);
  };

  // Close password dialog
  const closePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };

  // Open export dialog after successful password entry
  const openExportDialog = () => {
    setExportDialogOpen(true);
  };
  
  // Close export dialog
  const closeExportDialog = () => {
    setExportDialogOpen(false);
  };
  
  // Welcome dialog and guided tour functions
  const closeWelcomeDialog = () => {
    setWelcomeDialogOpen(false);
  };
  
  const startGuidedTour = () => {
    setTourStep(1);
    setGuidedTourOpen(true);
  };
  
  const nextTourStep = () => {
    if (tourStep < totalTourSteps) {
      setTourStep(tourStep + 1);
    }
  };
  
  const prevTourStep = () => {
    if (tourStep > 1) {
      setTourStep(tourStep - 1);
    }
  };
  
  const endGuidedTour = () => {
    setGuidedTourOpen(false);
  };
  
  // Function to show the welcome dialog (can be triggered from help button)
  const showWelcomeDialog = () => {
    setWelcomeDialogOpen(true);
  };
  
  // Function to create a new flow
  const createNewFlow = () => {
    // Clear the current flow
    setNodes([]);
    setEdges([]);
    setFlowName('New Flow');
    
    // Add a default Begin node to start with
    const newNode = {
      id: uuidv4(),
      type: 'begin',
      position: { x: 250, y: 100 },
      data: { label: 'Begin' }
    };
    
    setNodes([newNode]);
    
    // Close any open dialogs
    setCreateNewFlowDialogOpen(false);
  };
  
  // Function to handle publishing a flow
  const handlePublish = (orderId: string) => {
    setCurrentOrderId(orderId);
    
    // Update the saved flow status to published
    if (nodes.length > 0) {
      takeScreenshot().then((dataUrl) => {
        if (!dataUrl) return;
        
        // Update the current flow in savedFlows
        const updatedFlows = savedFlows.map(flow => {
          if (flow.name === flowName) {
            return {
              ...flow,
              status: 'published' as 'draft' | 'published',
              orderId: orderId,
              thumbnail: dataUrl,
              data: JSON.stringify({ nodes, edges, flowName })
            };
          }
          return flow;
        });
        
        setSavedFlows(updatedFlows);
        localStorage.setItem('savedFlows', JSON.stringify(updatedFlows));
      });
    }
    
    // After successful publish, show the order tracking page
    setTimeout(() => {
      setShowOrderTracking(true);
    }, 5000);
  };
  
  // Function to publish a saved flow
  const publishSavedFlow = (flow: SavedFlow) => {
    // Load the flow first
    loadFlow(flow.data);
    
    // Then open the publish dialog
    setTimeout(() => {
      setPublishDialogOpen(true);
    }, 500);
  };
  
  // Function to toggle order tracking view
  const toggleOrderTracking = () => {
    setShowOrderTracking(!showOrderTracking);
  };
  
  // Tour step content functions
  const getTourStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Welcome to Call Builder';
      case 2: return 'Node Panel';
      case 3: return 'Begin Node';
      case 4: return 'Conversation Node';
      case 5: return 'If/Then Split Node';
      case 6: return 'Connect Node';
      case 7: return 'Call Transfer & Press Digit Nodes';
      case 8: return 'Ending Node';
      default: return 'Call Builder Tour';
    }
  };
  
  const getTourStepContent = (step: number): React.ReactNode => {
    switch (step) {
      case 1:
        return (
          <Typography variant="body2">
            Welcome to the Talk Small Business Call Builder! This tour will guide you through 
            the basics of creating your own call flows. Let's get started!
          </Typography>
        );
      case 2:
        return (
          <Typography variant="body2">
            This panel contains all the building blocks you'll need. Drag any node from here 
            onto the canvas to start building your call flow.
          </Typography>
        );
      case 3:
        return (
          <Typography variant="body2">
            The Begin Node is the starting point of your call flow. Every flow must have one Begin node. 
            It's where your caller's journey starts.
          </Typography>
        );
      case 4:
        return (
          <Typography variant="body2">
            Conversation Nodes let you speak to your caller. You can add messages that will be 
            spoken and create transitions for different caller responses.
          </Typography>
        );
      case 5:
        return (
          <Typography variant="body2">
            The If/Then Split creates a decision point in your call flow. If a condition is true, 
            the call follows the THEN path; otherwise, it follows the ELSE path.
          </Typography>
        );
      case 6:
        return (
          <Typography variant="body2">
            Connect Nodes link your call flow to external systems like your CRM, helpdesk, or 
            other business tools to look up or store customer information.
          </Typography>
        );
      case 7:
        return (
          <Typography variant="body2">
            Call Transfer Nodes direct callers to agents or departments. Press Digit Nodes create 
            menus where callers can press keys to navigate different paths.
          </Typography>
        );
      case 8:
        return (
          <Typography variant="body2">
            Ending Nodes mark the conclusion of a call path. You can configure different ending types 
            like hangup, transfer, or voicemail.
          </Typography>
        );
      default:
        return <Typography variant="body2">Explore and build your call flow!</Typography>;
    }
  };
  
  const getTourStepTarget = (step: number): string => {
    switch (step) {
      case 2: return '.MuiDrawer-root .MuiList-root'; // Node panel
      case 3: return '.MuiList-root .MuiListItem-root:nth-child(7)'; // Begin node in panel
      case 4: return '.MuiList-root .MuiListItem-root:nth-child(1)'; // Conversation node in panel
      case 5: return '.MuiList-root .MuiListItem-root:nth-child(5)'; // Logic Split node in panel
      case 6: return '.MuiList-root .MuiListItem-root:nth-child(2)'; // Function/Connect node in panel
      case 7: return '.MuiList-root .MuiListItem-root:nth-child(3), .MuiList-root .MuiListItem-root:nth-child(4)'; // Call Transfer & Press Digit nodes
      case 8: return '.MuiList-root .MuiListItem-root:nth-child(6)'; // Ending node in panel
      default: return '';
    }
  };

  // Get auth context
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    // Redirection is handled by the ProtectedRoute component
  };
  
  // Handle area code selector dialog
  const [areaCodeDialogOpen, setAreaCodeDialogOpen] = useState(false);
  
  const handleOpenAreaCodeDialog = () => {
    setAreaCodeDialogOpen(true);
  };
  
  const handleCloseAreaCodeDialog = () => {
    setAreaCodeDialogOpen(false);
  };

  // Check if user needs to complete onboarding
  useEffect(() => {
    if (user && profile && profile.onboarding_completed === false) {
      setShowAreaCodeSelector(true);
    }
  }, [user, profile]);

  // Handle area code selection completion
  const handleAreaCodeSelectionComplete = () => {
    setShowAreaCodeSelector(false);
  };

  // Show area code selector if needed
  if (showAreaCodeSelector) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AreaCodeSelector onComplete={handleAreaCodeSelectionComplete} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: '#0a2472' }}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              {/* Left side - Title */}
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Talk Small Business - Call Builder
              </Typography>
              
              {/* Center - Flow name */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ mr: 1 }}>Flow Name:</Typography>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    width: '150px'
                  }}
                />
              </Box>
              
              {/* Right side - Action buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={createNewFlow}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Create
                </Button>
                
                <Button 
                  variant="contained" 
                  color="secondary"
                  startIcon={<PublishIcon />}
                  onClick={() => setPublishDialogOpen(true)}
                  size="small"
                  sx={{ mr: 1, bgcolor: '#00968f', '&:hover': { bgcolor: '#007a73' } }}
                  disabled={nodes.length === 0}
                >
                  Publish
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={toggleOrderTracking}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  {showOrderTracking ? 'Editor' : 'Orders'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={saveFlow}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  Save
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={openSavedFlows}
                  size="small"
                  sx={{ mr: 1 }}
                >
                  My Flows
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<BuildIcon />}
                  onClick={openPasswordDialog}
                  size="small"
                  sx={{ mr: 1 }}
                  title="Developer Tools"
                >
                  Dev Tools
                </Button>
                
                <Tooltip title="Help">
                  <IconButton color="inherit" onClick={showWelcomeDialog}>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Phone Number">
                  <IconButton color="inherit" onClick={handleOpenAreaCodeDialog}>
                    <DialpadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Logout">
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', marginTop: '64px' },
          }}
          open={drawerOpen}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              ADD NEW NODE
            </Typography>
            <List>
              <ListItem 
                button 
                onClick={() => addNode('conversation')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <MessageIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Conversation" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('function')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <CodeIcon sx={{ color: '#ff9800' }} />
                </ListItemIcon>
                <ListItemText primary="Function" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('callTransfer')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <CallIcon sx={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText primary="Call Transfer" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('pressDigit')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <DialpadIcon sx={{ color: '#9c27b0' }} />
                </ListItemIcon>
                <ListItemText primary="Press Digit" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('logicSplit')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <AccountTreeIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText primary="Logic Split Node" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('ending')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <StopIcon sx={{ color: '#f44336' }} />
                </ListItemIcon>
                <ListItemText primary="Ending" />
              </ListItem>
              
              <ListItem 
                button 
                onClick={() => addNode('begin')}
                sx={{ mb: 1, bgcolor: '#f0f4ff', borderRadius: 1 }}
              >
                <ListItemIcon>
                  <PlayCircleFilledIcon sx={{ color: '#673ab7' }} />
                </ListItemIcon>
                <ListItemText primary="Begin" />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            {selectedNode && (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={deleteSelectedNode}
                fullWidth
              >
                Delete Selected
              </Button>
            )}
          </Box>
        </Drawer>
        
        <Box component="main" sx={{ flexGrow: 1, p: 0, position: 'relative' }}>
          <Toolbar />
          <div ref={reactFlowWrapper} style={{ width: '100%', height: 'calc(100% - 64px)' }}>
            {showOrderTracking ? (
              <OrderTrackingPage 
                isAdmin={false}
                onBack={() => setShowOrderTracking(false)}
                currentFlowId={currentOrderId}
                currentFlowName={flowName}
              />
            ) : (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
              >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              </ReactFlow>
            )}
          </div>
        </Box>
        
        {configPanelOpen && selectedNode && (
          <NodeConfigPanel 
            node={selectedNode}
            updateNodeData={updateNodeData}
            onClose={() => setConfigPanelOpen(false)}
          />
        )}
        
        {/* Confetti Animation */}
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        )}
      </Box>
      {/* Saved Flows Dialog */}
      <SavedFlowsTable 
        savedFlows={savedFlows} 
        onLoad={loadFlow} 
        onDelete={deleteSavedFlow} 
        onPublish={publishSavedFlow}
        open={savedFlowsOpen}
        onClose={() => setSavedFlowsOpen(false)}
      />

      {/* Password Protection Dialog */}
      <PasswordDialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        onPasswordCorrect={handlePasswordCorrect}
      />
      
      <DeveloperPanel
        open={developerPanelOpen}
        onClose={() => setDeveloperPanelOpen(false)}
      />
      
      {/* Export for Developers Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onClose={closeExportDialog}
        nodes={nodes}
        edges={edges}
        flowName={flowName}
      />
      
      {/* Welcome and Onboarding Dialog */}
      <Dialog
        open={welcomeDialogOpen}
        onClose={closeWelcomeDialog}
        maxWidth="lg"
      >
        <DialogTitle>Welcome to Call Builder</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Welcome to the Talk Small Business Call Builder! This tour will guide you through 
            the basics of creating your own call flows. Let's get started!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWelcomeDialog}>Skip Tour</Button>
          <Button onClick={startGuidedTour}>Start Tour</Button>
        </DialogActions>
      </Dialog>
      
      {/* Guided Tour Overlay */}
      <OnboardingTour
        open={guidedTourOpen}
        onClose={endGuidedTour}
        currentStep={tourStep}
        totalSteps={totalTourSteps}
        onNext={nextTourStep}
        onPrev={prevTourStep}
        title={getTourStepTitle(tourStep)}
        content={getTourStepContent(tourStep)}
        targetElement={getTourStepTarget(tourStep)}
      />
      
      {/* Area Code Selector Dialog */}
      <Dialog
        open={areaCodeDialogOpen}
        onClose={handleCloseAreaCodeDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <AreaCodeSelector onComplete={handleCloseAreaCodeDialog} />
        </DialogContent>
      </Dialog>
      
      {/* Publish Dialog */}
      <PublishDialog
        open={publishDialogOpen}
        onClose={() => setPublishDialogOpen(false)}
        flowName={flowName}
        onPublish={handlePublish}
      />
    </ThemeProvider>
  );
}

export default App;
