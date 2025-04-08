import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Chip } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const ConversationNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#3f51b5' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ChatIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Conversation'}
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      {data.message && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#f5f8ff', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          {data.message}
        </Box>
      )}
      
      {data.transitions && data.transitions.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {data.transitions.map((transition: any, index: number) => (
            <Box 
              key={transition.id || index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                position: 'relative',
                mb: 1,
                p: 0.5,
                '&:hover': {
                  backgroundColor: '#f0f7ff',
                  borderRadius: '4px'
                }
              }}
            >
              <Chip 
                label={transition.text} 
                size="small" 
                sx={{ 
                  bgcolor: '#e3f2fd', 
                  borderRadius: '16px',
                  '& .MuiChip-label': { px: 1 }
                }} 
              />
              
              <Handle
                type="source"
                position={Position.Right}
                id={`transition-${transition.id || index}`}
                isConnectable={isConnectable}
                style={{ 
                  background: '#4caf50',
                  width: 8,
                  height: 8,
                  right: -4
                }}
              />
            </Box>
          ))}
        </Box>
      )}
      
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

export default memo(ConversationNode);
