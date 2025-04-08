import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Chip, Stack } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

interface Option {
  id: string;
  text: string;
}

const OptionsNode = ({ data, isConnectable, id }: NodeProps) => {
  const options: Option[] = data.options || [];
  
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
        <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Message + Options
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
      
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        {options.length > 0 ? (
          options.map((option: Option, index: number) => (
            <Box 
              key={option.id} 
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
                label={option.text} 
                size="small" 
                sx={{ 
                  bgcolor: '#e3f2fd', 
                  borderRadius: '16px',
                  '& .MuiChip-label': { px: 1 }
                }} 
              />

              
              {/* Add a handle for each option */}
              <Handle
                type="source"
                position={Position.Right}
                id={`option-${option.id}`}
                isConnectable={isConnectable}
                style={{ 
                  background: '#4caf50',
                  width: 8,
                  height: 8,
                  right: -4
                }}
              />
            </Box>
          ))
        ) : (
          <Typography variant="caption" color="text.secondary">
            No options defined
          </Typography>
        )}
      </Stack>
      
      {/* Keep the main bottom handle for general connections */}
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

export default memo(OptionsNode);
