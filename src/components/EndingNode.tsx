import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';

const EndingNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      borderLeft: '4px solid #f44336',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#f44336' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <StopIcon sx={{ mr: 1, color: '#f44336' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Ending'}
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      {data.message && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#ffebee', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          {data.message}
        </Box>
      )}
      
      {data.endType && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#ffebee', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
            End Type:
          </Typography>
          {data.endType}
        </Box>
      )}
    </Paper>
  );
};

export default memo(EndingNode);
