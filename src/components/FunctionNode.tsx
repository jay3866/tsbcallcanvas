import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Tooltip } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FunctionNode = ({ data, isConnectable, id }: NodeProps) => {
  // Extract the system type from data or default to 'CRM'
  const systemType = data.systemType || 'CRM';
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      borderLeft: '4px solid #ff9800',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#ff9800' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <SystemUpdateAltIcon sx={{ mr: 1, color: '#ff9800' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Connect'}
        </Typography>
        <Tooltip title="This node connects your call flow to your external systems" arrow placement="top">
          <HelpOutlineIcon sx={{ ml: 1, color: 'text.secondary', fontSize: '0.9rem', cursor: 'help' }} />
        </Tooltip>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 1, 
        mb: 1,
        bgcolor: '#fff8e1', 
        borderRadius: 1, 
        fontSize: '0.875rem',
        wordBreak: 'break-word'
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          Connect to:
        </Typography>
        <Typography sx={{ fontWeight: 'medium' }}>
          {systemType}
        </Typography>
        {data.systemName && (
          <>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, mb: 0.5 }}>
              System Name:
            </Typography>
            <Typography>
              {data.systemName}
            </Typography>
          </>
        )}
      </Box>
      
      {data.notes && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
            Notes:
          </Typography>
          <Box sx={{ 
            p: 1, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1, 
            fontSize: '0.75rem',
            wordBreak: 'break-word'
          }}>
            {data.notes}
          </Box>
        </Box>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
        style={{ background: '#ff9800' }}
      />
    </Paper>
  );
};

export default memo(FunctionNode);
