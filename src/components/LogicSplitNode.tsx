import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Divider } from '@mui/material';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import Tooltip from '@mui/material/Tooltip';

const LogicSplitNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      borderLeft: '4px solid #2196f3',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#2196f3' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <CallSplitIcon sx={{ mr: 1, color: '#2196f3' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'If/Then Split'}
        </Typography>
        <Tooltip title="This node creates two paths based on a condition" arrow placement="top">
          <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', cursor: 'help' }}>
            (?)
          </Typography>
        </Tooltip>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      <Box sx={{ 
        p: 1, 
        mb: 1,
        bgcolor: '#e3f2fd', 
        borderRadius: 1, 
        fontSize: '0.875rem',
        wordBreak: 'break-word'
      }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
          IF:
        </Typography>
        <Typography sx={{ fontWeight: 'medium' }}>
          {data.condition ? data.condition : 'No condition set'}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', mt: 2 }}>
        <Box sx={{ 
          p: 1, 
          bgcolor: '#e8f5e9', 
          borderRadius: 1, 
          fontSize: '0.75rem',
          width: '45%',
          textAlign: 'center',
          position: 'relative',
          border: '1px solid #81c784'
        }}>
          <Typography sx={{ fontWeight: 'medium', color: '#2e7d32' }}>
            THEN
          </Typography>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            isConnectable={isConnectable}
            style={{ 
              background: '#4caf50',
              bottom: -15,
              left: '50%'
            }}
          />
        </Box>
        
        <Box sx={{ 
          p: 1, 
          bgcolor: '#ffebee', 
          borderRadius: 1, 
          fontSize: '0.75rem',
          width: '45%',
          textAlign: 'center',
          position: 'relative',
          border: '1px solid #e57373'
        }}>
          <Typography sx={{ fontWeight: 'medium', color: '#c62828' }}>
            ELSE
          </Typography>
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            isConnectable={isConnectable}
            style={{ 
              background: '#f44336',
              bottom: -15,
              left: '50%'
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default memo(LogicSplitNode);
