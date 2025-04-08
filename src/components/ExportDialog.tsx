import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  IconButton,
  TextField,
  Divider,
  Chip,
  Tooltip
} from '@mui/material';
import { Node, Edge } from 'reactflow';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GetAppIcon from '@mui/icons-material/GetApp';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DescriptionIcon from '@mui/icons-material/Description';
import ReactFlow, { ReactFlowProvider, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  flowName: string;
}

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
      id={`export-tabpanel-${index}`}
      aria-labelledby={`export-tab-${index}`}
      {...other}
      style={{ height: value === index ? '100%' : 0 }}
    >
      {value === index && (
        <Box sx={{ p: 2, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `export-tab-${index}`,
    'aria-controls': `export-tabpanel-${index}`,
  };
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onClose,
  nodes,
  edges,
  flowName
}) => {
  const [value, setValue] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Generate a human-readable description of the flow
  const generateFlowDescription = () => {
    if (!nodes.length) return 'No nodes in this flow.';

    // Sort nodes by their position to follow a logical flow
    const sortedNodes = [...nodes].sort((a, b) => {
      if (!a.position || !b.position) return 0;
      if (a.position.y === b.position.y) return a.position.x - b.position.x;
      return a.position.y - b.position.y;
    });

    // Find start nodes (usually have no incoming edges)
    const startNodes = sortedNodes.filter(node => {
      return !edges.some(edge => edge.target === node.id);
    });

    let description = `# Call Flow: ${flowName}\n\n`;
    description += `## Overview\n\n`;
    description += `This call flow contains ${nodes.length} nodes and ${edges.length} connections.\n\n`;
    
    description += `## Starting Points\n\n`;
    if (startNodes.length === 0) {
      description += `No clear starting points detected.\n\n`;
    } else {
      startNodes.forEach(node => {
        description += `- ${node.data?.label || node.id} (${node.type || 'Unknown type'})\n`;
        if (node.data?.message) {
          description += `  Message: "${node.data.message}"\n`;
        }
      });
      description += '\n';
    }

    description += `## All Nodes\n\n`;
    sortedNodes.forEach((node, index) => {
      description += `### ${index + 1}. ${node.data?.label || 'Unnamed'} (${node.type || 'Unknown type'})\n`;
      description += `- ID: ${node.id}\n`;
      
      // Add node-specific details
      if (node.type === 'function') {
        description += `- System Type: ${node.data?.systemType || 'Not specified'}\n`;
        description += `- System Name: ${node.data?.systemName || 'Not specified'}\n`;
        if (node.data?.notes) {
          description += `- Notes: "${node.data.notes}"\n`;
        }
      } else if (node.type === 'conversation') {
        description += `- Message: "${node.data?.message || 'No message'}"\n`;
        if (node.data?.transitions && node.data.transitions.length > 0) {
          description += `- Transitions:\n`;
          node.data.transitions.forEach((transition: any) => {
            description += `  * ${transition.text}\n`;
          });
        }
      } else if (node.type === 'logicSplit') {
        description += `- Condition: ${node.data?.condition || 'No condition'}\n`;
        description += `- Has TRUE path: ${edges.some(edge => edge.source === node.id && edge.sourceHandle === 'true') ? 'Yes' : 'No'}\n`;
        description += `- Has FALSE path: ${edges.some(edge => edge.source === node.id && edge.sourceHandle === 'false') ? 'Yes' : 'No'}\n`;
      } else if (node.type === 'options') {
        if (node.data?.options && node.data.options.length > 0) {
          description += `- Options:\n`;
          node.data.options.forEach((option: any) => {
            description += `  * ${option.text}\n`;
          });
        }
      } else if (node.type === 'callTransfer') {
        description += `- Transfer Type: ${node.data?.transferType || 'Not specified'}\n`;
        description += `- Destination: ${node.data?.destination || 'Not specified'}\n`;
      } else if (node.type === 'pressDigit') {
        description += `- Prompt: "${node.data?.prompt || 'No prompt'}"\n`;
        if (node.data?.activeDigits && node.data.activeDigits.length > 0) {
          description += `- Active Digits: ${node.data.activeDigits.join(', ')}\n`;
        }
      } else if (node.type === 'ending') {
        description += `- End Type: ${node.data?.endType || 'Not specified'}\n`;
      }
      
      // Add connections
      const outgoingEdges = edges.filter(edge => edge.source === node.id);
      if (outgoingEdges.length > 0) {
        description += `- Connections:\n`;
        outgoingEdges.forEach(edge => {
          const targetNode = nodes.find(n => n.id === edge.target);
          const connectionType = edge.sourceHandle ? `(${edge.sourceHandle})` : '';
          description += `  * ${connectionType} → ${targetNode?.data?.label || edge.target} (${targetNode?.type || 'Unknown'})\n`;
        });
      } else if (node.type !== 'ending') {
        description += `- No outgoing connections (dead end)\n`;
      }
      
      description += '\n';
    });

    // Add flow validation notes
    const deadEnds = nodes.filter(node => {
      return node.type !== 'ending' && !edges.some(edge => edge.source === node.id);
    });

    if (deadEnds.length > 0) {
      description += `## Potential Issues\n\n`;
      description += `### Dead Ends\n`;
      description += `The following nodes have no outgoing connections (except ending nodes):\n`;
      deadEnds.forEach(node => {
        description += `- ${node.data?.label || 'Unnamed'} (${node.type || 'Unknown type'})\n`;
      });
      description += '\n';
    }

    // Add implementation notes
    description += `## Implementation Notes\n\n`;
    description += `### System Integrations\n`;
    const systemNodes = nodes.filter(node => node.type === 'function');
    if (systemNodes.length === 0) {
      description += `No external system integrations required.\n\n`;
    } else {
      systemNodes.forEach(node => {
        description += `- ${node.data?.systemType || 'Unknown system'}: ${node.data?.systemName || 'No name'}\n`;
        if (node.data?.notes) {
          description += `  Details: ${node.data.notes}\n`;
        }
      });
      description += '\n';
    }

    description += `### Decision Points\n`;
    const decisionNodes = nodes.filter(node => node.type === 'logicSplit');
    if (decisionNodes.length === 0) {
      description += `No decision points in this flow.\n\n`;
    } else {
      decisionNodes.forEach(node => {
        description += `- ${node.data?.label || 'Unnamed'}: ${node.data?.condition || 'No condition specified'}\n`;
      });
      description += '\n';
    }

    description += `### User Interactions\n`;
    const interactionNodes = nodes.filter(node => 
      node.type === 'options' || 
      node.type === 'pressDigit' || 
      node.type === 'conversation'
    );
    
    if (interactionNodes.length === 0) {
      description += `No user interaction nodes in this flow.\n`;
    } else {
      interactionNodes.forEach(node => {
        description += `- ${node.data?.label || 'Unnamed'} (${node.type})`;
        if (node.type === 'options' && node.data?.options) {
          description += `: ${node.data.options.length} options\n`;
        } else if (node.type === 'pressDigit' && node.data?.activeDigits) {
          description += `: ${node.data.activeDigits.length} active digits\n`;
        } else if (node.type === 'conversation' && node.data?.message) {
          description += `: "${node.data.message.substring(0, 50)}${node.data.message.length > 50 ? '...' : ''}"\n`;
        } else {
          description += '\n';
        }
      });
    }

    return description;
  };

  // Generate JSON representation of the flow
  const generateJsonExport = () => {
    const exportData = {
      name: flowName,
      exportedAt: new Date().toISOString(),
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle,
        target: edge.target,
        targetHandle: edge.targetHandle
      })),
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodeTypes: Array.from(new Set(nodes.map(node => node.type || ''))),
      }
    };

    return JSON.stringify(exportData, null, 2);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (content: string, fileType: string, fileName: string) => {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const jsonExport = generateJsonExport();
  const markdownExport = generateFlowDescription();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { height: '90vh' }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Developer Export: {flowName}
          </Typography>
          <Chip 
            label={copied ? "Copied!" : ""} 
            color="success" 
            size="small" 
            sx={{ ml: 2, visibility: copied ? 'visible' : 'hidden' }}
          />
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="export tabs">
          <Tab 
            icon={<DescriptionIcon />} 
            iconPosition="start" 
            label="Documentation" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<CodeIcon />} 
            iconPosition="start" 
            label="JSON Export" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<AccountTreeIcon />} 
            iconPosition="start" 
            label="Visual Flow" 
            {...a11yProps(2)} 
          />
        </Tabs>
      </Box>
      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={() => handleCopyToClipboard(markdownExport)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download as Markdown">
              <IconButton onClick={() => handleDownload(markdownExport, 'text/markdown', `${flowName.replace(/\s+/g, '_')}_documentation.md`)}>
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              height: 'calc(100% - 48px)', 
              overflowY: 'auto',
              bgcolor: '#f9f9f9',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap'
            }}
          >
            {markdownExport}
          </Paper>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={() => handleCopyToClipboard(jsonExport)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download as JSON">
              <IconButton onClick={() => handleDownload(jsonExport, 'application/json', `${flowName.replace(/\s+/g, '_')}.json`)}>
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            multiline
            fullWidth
            variant="outlined"
            value={jsonExport}
            InputProps={{
              readOnly: true,
              sx: { 
                fontFamily: 'monospace', 
                fontSize: '0.875rem',
                height: 'calc(100% - 48px)',
                '& .MuiOutlinedInput-root': {
                  height: '100%',
                },
                '& .MuiInputBase-inputMultiline': {
                  height: '100% !important',
                  overflowY: 'auto !important'
                }
              }
            }}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Box sx={{ height: '100%', width: '100%' }}>
            <ReactFlowProvider>
              <div style={{ height: '100%', width: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  zoomOnScroll={true}
                  zoomOnPinch={true}
                  panOnScroll={true}
                  fitView
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;
