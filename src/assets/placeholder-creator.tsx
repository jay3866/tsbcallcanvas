import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import MessageIcon from '@mui/icons-material/Message';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import CallIcon from '@mui/icons-material/Call';
import DialpadIcon from '@mui/icons-material/Dialpad';
import StopIcon from '@mui/icons-material/Stop';

// This file is just for reference - we'll use these SVG strings to create placeholder images
// until real screenshots can be taken

const createPlaceholderSVG = (icon: JSX.Element, color: string, name: string) => {
  const svg = renderToStaticMarkup(
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa" rx="8" ry="8" stroke={color} strokeWidth="2" />
      <g transform="translate(20, 50)">
        {icon}
      </g>
      <text x="70" y="55" fontFamily="Arial" fontSize="14" fontWeight="bold">{name}</text>
    </svg>
  );
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Example usage:
// const beginNodeImg = createPlaceholderSVG(<PlayCircleFilledIcon style={{ fontSize: 40, color: '#4caf50' }} />, '#4caf50', 'Begin Node');

// We'll replace these with actual screenshots later
export const placeholders = {
  beginNodeImg: 'data:image/svg+xml;base64,...',
  conversationNodeImg: 'data:image/svg+xml;base64,...',
  ifThenNodeImg: 'data:image/svg+xml;base64,...',
  connectNodeImg: 'data:image/svg+xml;base64,...',
  transferNodeImg: 'data:image/svg+xml;base64,...',
  pressDigitNodeImg: 'data:image/svg+xml;base64,...',
  endingNodeImg: 'data:image/svg+xml;base64,...',
};
