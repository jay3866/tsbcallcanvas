import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paper, Typography, Box, Grid } from '@mui/material';
import DialpadIcon from '@mui/icons-material/Dialpad';

const PressDigitNode = ({ data, isConnectable, id }: NodeProps) => {
  // Define the digits for the keypad
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  
  // Count active digits for better handle positioning
  const activeDigits = data.activeDigits || [];
  const activeDigitCount = activeDigits.length;
  
  return (
    <Paper elevation={2} sx={{ 
      p: 2, 
      borderRadius: 2,
      width: 220,
      border: '1px solid #e0e0e0',
      borderLeft: '4px solid #9c27b0',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      },
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ background: '#9c27b0' }}
      />
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <DialpadIcon sx={{ mr: 1, color: '#9c27b0' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {data.label || 'Press Digit'}
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto', color: 'text.secondary' }}>
          {id.substring(0, 6)}
        </Typography>
      </Box>
      
      {data.prompt && (
        <Box sx={{ 
          p: 1, 
          mb: 1,
          bgcolor: '#f3e5f5', 
          borderRadius: 1, 
          fontSize: '0.875rem',
          wordBreak: 'break-word'
        }}>
          {data.prompt}
        </Box>
      )}
      
      {activeDigitCount > 0 && (
        <Typography variant="caption" sx={{ display: 'block', mt: 1, mb: 0.5, color: '#9c27b0', fontWeight: 'medium' }}>
          {activeDigitCount} {activeDigitCount === 1 ? 'digit' : 'digits'} selected
        </Typography>
      )}
      
      <Box sx={{ mt: 1, position: 'relative' }}>
        <Grid container spacing={1}>
          {digits.map((digit) => {
            const isActive = activeDigits.includes(digit);
            
            return (
              <Grid item xs={4} key={digit}>
                <Box
                  sx={{
                    width: '100%',
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid',
                    borderColor: isActive ? '#9c27b0' : '#e0e0e0',
                    borderRadius: 1,
                    bgcolor: isActive ? '#f3e5f5' : 'transparent',
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#9c27b0' : 'text.primary',
                    position: 'relative',
                  }}
                >
                  {digit}
                  
                  {isActive && (
                    <Handle
                      type="source"
                      position={Position.Bottom}
                      id={`digit-${digit}`}
                      isConnectable={isConnectable}
                      style={{ 
                        background: '#9c27b0',
                        width: 10,
                        height: 10,
                        bottom: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 10
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
        
        {/* Label for each active digit handle */}
        {activeDigits.map((digit) => (
          <Typography 
            key={`label-${digit}`} 
            variant="caption" 
            sx={{
              position: 'absolute',
              bottom: -40,
              left: `${(digits.indexOf(digit) % 3) * 33.33 + 16.5}%`,
              transform: 'translateX(-50%)',
              color: '#9c27b0',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              zIndex: 5
            }}
          >
            {digit}
          </Typography>
        ))}
      </Box>
      
      {/* Default handle for when no digit is pressed */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="default"
        isConnectable={isConnectable}
        style={{ 
          background: '#9c27b0',
          bottom: -15,
          zIndex: 1
        }}
      />
    </Paper>
  );
};

export default memo(PressDigitNode);
