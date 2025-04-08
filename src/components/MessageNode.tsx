import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';

const MessageNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#3f51b5' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <MessageIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Message
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 1, 
        bgcolor: '#f5f8ff', 
        borderRadius: 1, 
        fontSize: '0.875rem',
        wordBreak: 'break-word'
      }}>
        {data.message || 'Empty message'}
      </Box>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
        style={{ background: '#3f51b5' }}
      />
    </Paper>
  );
};

export default memo(MessageNode);
