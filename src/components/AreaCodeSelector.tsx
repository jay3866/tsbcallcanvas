import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField,
  Fade,
  Zoom,
  CircularProgress,
  useTheme
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../supabase/client';
import { useAuth } from '../supabase/AuthContext';

// Popular area codes with their locations
const POPULAR_AREA_CODES = [
  { code: '212', location: 'New York, NY' },
  { code: '213', location: 'Los Angeles, CA' },
  { code: '312', location: 'Chicago, IL' },
  { code: '305', location: 'Miami, FL' },
  { code: '415', location: 'San Francisco, CA' },
  { code: '202', location: 'Washington, DC' },
  { code: '617', location: 'Boston, MA' },
  { code: '702', location: 'Las Vegas, NV' },
  { code: '512', location: 'Austin, TX' },
  { code: '404', location: 'Atlanta, GA' },
  { code: '615', location: 'Nashville, TN' },
  { code: '303', location: 'Denver, CO' },
];

interface AreaCodeSelectorProps {
  onComplete: () => void;
}

const AreaCodeSelector: React.FC<AreaCodeSelectorProps> = ({ onComplete }) => {
  const theme = useTheme();
  const { user, refreshProfile } = useAuth();
  const [areaCode, setAreaCode] = useState<string>('');
  const [digit1, setDigit1] = useState<string>('');
  const [digit2, setDigit2] = useState<string>('');
  const [digit3, setDigit3] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedPopularCode, setSelectedPopularCode] = useState<string | null>(null);

  // Refs for the input fields
  const digit1Ref = React.useRef<HTMLInputElement>(null);
  const digit2Ref = React.useRef<HTMLInputElement>(null);
  const digit3Ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus on the first digit input when component mounts
    if (digit1Ref.current) {
      digit1Ref.current.focus();
    }
  }, []);

  useEffect(() => {
    // Update the area code when digits change
    const newAreaCode = `${digit1}${digit2}${digit3}`;
    setAreaCode(newAreaCode);
  }, [digit1, digit2, digit3]);

  // Handle input changes and auto-focus to next field
  const handleDigitChange = (
    value: string, 
    setDigit: React.Dispatch<React.SetStateAction<string>>,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    // Only allow a single digit
    if (/^\d?$/.test(value)) {
      setDigit(value);
      // Move to next input if a digit was entered
      if (value && nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  // Handle selection of a popular area code
  const handlePopularCodeClick = (code: string) => {
    setSelectedPopularCode(code);
    setDigit1(code[0]);
    setDigit2(code[1]);
    setDigit3(code[2]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (areaCode.length !== 3 || !/^\d{3}$/.test(areaCode)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a random phone number with the selected area code
      const randomNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      const formattedPhoneNumber = `(${areaCode}) ${randomNumber.substring(0, 3)}-${randomNumber.substring(3)}`;
      setPhoneNumber(formattedPhoneNumber);

      // Save the area code and phone number to the user's profile
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            area_code: areaCode,
            phone_number: formattedPhoneNumber,
            onboarding_completed: true
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
        } else {
          // Refresh the user profile
          await refreshProfile();
          
          // Complete immediately without showing success screen
          onComplete();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation styles
  const hoverStyle = {
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  if (isSuccess) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Zoom in={true} timeout={500}>
          <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main' }} />
        </Zoom>
        
        <Fade in={true} timeout={1000} style={{ transitionDelay: '300ms' }}>
          <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
            Your number is ready!
          </Typography>
        </Fade>
        
        <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
          <Typography variant="h5" sx={{ mb: 3, color: 'primary.main', fontWeight: 'medium' }}>
            {phoneNumber}
          </Typography>
        </Fade>
        
        <Fade in={true} timeout={1000} style={{ transitionDelay: '900ms' }}>
          <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 500 }}>
            We've assigned you a phone number with your preferred area code.
            You can use this for your call flows.
          </Typography>
        </Fade>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={6} 
          sx={{ 
            p: 6, 
            borderRadius: 4,
            mx: 'auto',
            maxWidth: 800,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              opacity: 0.1,
              zIndex: 0
            }}
          />
          
          <Fade in={true} timeout={1000}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PhoneIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" fontWeight="bold">
                Choose Your Area Code
              </Typography>
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Typography variant="body1" sx={{ mb: 5, maxWidth: 600 }}>
              Select an area code for your business phone number. This will be used for your call flows
              and will help your customers recognize your location.
            </Typography>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Enter your preferred area code:
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                {/* Three large input boxes for each digit */}
                <Box sx={{ margin: '0 8px', ...hoverStyle }}>
                  <TextField
                    inputRef={digit1Ref}
                    value={digit1}
                    onChange={(e) => handleDigitChange(e.target.value, setDigit1, digit2Ref)}
                    variant="outlined"
                    inputProps={{ 
                      maxLength: 1, 
                      style: { 
                        fontSize: 36, 
                        textAlign: 'center',
                        width: '60px',
                        height: '60px',
                        padding: 0
                      } 
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        width: 80,
                        height: 80,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        boxShadow: 1
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ margin: '0 8px', ...hoverStyle }}>
                  <TextField
                    inputRef={digit2Ref}
                    value={digit2}
                    onChange={(e) => handleDigitChange(e.target.value, setDigit2, digit3Ref)}
                    variant="outlined"
                    inputProps={{ 
                      maxLength: 1, 
                      style: { 
                        fontSize: 36, 
                        textAlign: 'center',
                        width: '60px',
                        height: '60px',
                        padding: 0
                      } 
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        width: 80,
                        height: 80,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        boxShadow: 1
                      }
                    }}
                  />
                </Box>
                
                <Box sx={{ margin: '0 8px', ...hoverStyle }}>
                  <TextField
                    inputRef={digit3Ref}
                    value={digit3}
                    onChange={(e) => handleDigitChange(e.target.value, setDigit3)}
                    variant="outlined"
                    inputProps={{ 
                      maxLength: 1, 
                      style: { 
                        fontSize: 36, 
                        textAlign: 'center',
                        width: '60px',
                        height: '60px',
                        padding: 0
                      } 
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        width: 80,
                        height: 80,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'background.paper',
                        boxShadow: 1
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '600ms' }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Popular area codes:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {POPULAR_AREA_CODES.map((item) => (
                  <Box
                    key={item.code}
                    sx={{
                      ...hoverStyle,
                    }}
                  >
                    <Button
                      variant={selectedPopularCode === item.code ? "contained" : "outlined"}
                      onClick={() => handlePopularCodeClick(item.code)}
                      sx={{ 
                        borderRadius: 2,
                        minWidth: 'auto',
                        p: 1,
                        m: 0.5
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.code}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {item.location}
                        </Typography>
                      </Box>
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          </Fade>
          
          <Fade in={true} timeout={1000} style={{ transitionDelay: '800ms' }}>
            <Box sx={{
              display: 'flex', 
              justifyContent: 'center',
            }}>
              <Button
                variant="contained"
                size="large"
                disabled={areaCode.length !== 3 || isSubmitting}
                onClick={handleSubmit}
                sx={{ 
                  minWidth: 200,
                  borderRadius: 28,
                  py: 1.5,
                  boxShadow: 3,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <span>Get My Number</span>
                    <Fade in={true} timeout={500} style={{ transitionDelay: '1000ms' }}>
                      <Box sx={{ 
                        position: 'absolute',
                        right: 16,
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                        <PhoneIcon fontSize="small" />
                      </Box>
                    </Fade>
                  </>
                )}
              </Button>
            </Box>
          </Fade>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AreaCodeSelector;
