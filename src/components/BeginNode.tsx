import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

const BeginNode = ({ data, isConnectable, id }: NodeProps) => {
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 120,
      border: '1px solid #e0e0e0',
      bgcolor: '#673ab7',
      color: 'white',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      },
      position: 'relative'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PlayCircleFilledIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Begin
        </Typography>
      </Box>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
        style={{ 
          background: 'white',
          border: '2px solid #673ab7'
        }}
      />
    </Paper>
  );
};

export default memo(BeginNode);
