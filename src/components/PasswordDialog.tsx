import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onPasswordCorrect: () => void;
  requiredPassword?: string;
  title?: string;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  open,
  onClose,
  onPasswordCorrect,
  requiredPassword = 'TSB123$$',
  title = 'Developer Access Required'
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (error) setError(false);
  };

  const handleSubmit = () => {
    if (password === requiredPassword) {
      setPassword('');
      setError(false);
      setAttempts(0);
      onPasswordCorrect();
      onClose();
    } else {
      setError(true);
      setAttempts(attempts + 1);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    setAttempts(0);
    onClose();
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Typography variant="body1" gutterBottom>
            This area is restricted to authorized developers only.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please enter the developer password to continue.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            onKeyPress={handleKeyPress}
            error={error}
            helperText={error ? `Invalid password. ${attempts >= 3 ? 'Please contact your administrator.' : ''}` : ''}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Access Developer Tools
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordDialog;
