import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';

const CallTransferNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      borderLeft: '4px solid #4caf50',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#4caf50' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <CallIcon sx={{ mr: 1, color: '#4caf50' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Call Transfer'}
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      {data.transferType && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#f1f8e9', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
            Transfer Type:
          </Typography>
          {data.transferType}
        </Box>
      )}
      
      {data.destination && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#f1f8e9', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
            Destination:
          </Typography>
          {data.destination}
        </Box>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
        style={{ background: '#4caf50' }}
      />
    </Paper>
  );
};

export default memo(CallTransferNode);
