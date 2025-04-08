# Talk Small Business - Call Flow Builder

A modern, interactive web application for designing AI voice call flows for businesses. This tool allows users to create, edit, and manage inbound call flows through an intuitive drag-and-drop interface with cloud storage and user authentication.

## Features

- Create, edit, and delete nodes representing different parts of a call flow
- Drag and drop nodes to visually design the flow
- Connect nodes to create the call path
- Seven specialized node types:
  - Conversation: Welcome messages and basic interactions
  - Function: Connect to external systems
  - Call Transfer: Transfer calls to different departments
  - Press Digit: Collect numeric input from callers
  - Logic Split: Create IF/THEN decision paths
  - Ending: End the call flow
  - Begin: Starting point for all flows
- Interactive onboarding tour for new users
- User authentication with Supabase
- Cloud storage for call flows
- Developer export feature for implementation
- Order tracking system for submitted flows
- Area code selection for phone number assignment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (for backend functionality)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Drag node types from the left sidebar onto the canvas
2. Connect nodes by dragging from one node's handle to another
3. Click on nodes to edit their properties in the configuration panel
4. Save your flow using the Save button in the top bar
5. Load previously saved flows using the Load button

## Technologies Used

- React
- React Flow (for node-based interfaces)
- Material-UI
- TypeScript
- Supabase (authentication and database)
- Framer Motion (animations)

## License

MIT
