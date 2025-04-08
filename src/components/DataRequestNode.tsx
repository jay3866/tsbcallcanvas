import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

interface DataField {
  id: string;
  name: string;
  type: string;
}

const DataRequestNode = ({ data, isConnectable, id }: NodeProps) => {
  const dataFields: DataField[] = data.dataFields || [];
  
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
        <SettingsIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Data Request
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
      
      <Box sx={{ mt: 1 }}>
        {dataFields.length > 0 ? (
          dataFields.map((field: DataField) => (
            <Box 
              key={field.id} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 0.5,
                p: 0.5,
                borderRadius: 1,
                bgcolor: '#f0f7ff'
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main', fontSize: '1rem' }} />
              <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                {field.name}
              </Typography>
              <Chip 
                label={field.type} 
                size="small" 
                sx={{ 
                  ml: 'auto',
                  height: '20px',
                  '& .MuiChip-label': { 
                    px: 1, 
                    fontSize: '0.625rem' 
                  } 
                }} 
              />
            </Box>
          ))
        ) : (
          <Typography variant="caption" color="text.secondary">
            No data fields defined
          </Typography>
        )}
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

export default memo(DataRequestNode);
