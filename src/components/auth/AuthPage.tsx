import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <img 
            src="/talksmallbusiness-icon.png" 
            alt="Talk Small Business" 
            style={{ width: '120px', height: 'auto' }} 
          />
          <Typography variant="h5" component="h1" sx={{ mt: 2 }}>
            Talk Small Business
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            Call Flow Builder
          </Typography>
        </Box>
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <SignUpForm onToggleForm={toggleForm} />
        )}
      </Box>
    </Container>
  );
};

export default AuthPage;
