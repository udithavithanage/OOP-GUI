# Real-Time Ticketing System

This project simulates a real-time ticketing system that utilizes a Node.js backend with Express framework and a React frontend. WebSocket communication ensures real-time updates between the server and the clients.

## Features

- Vendor workers can add tickets at a controlled rate.
- Customer workers can fetch available tickets in real-time.
- Real-time synchronization using WebSocket for live updates between the frontend and backend.

## Technology Stack

### Backend

- **Node.js**: Server-side runtime environment.
- **Express**: Framework for handling routes and server logic.
- **WebSocket**: Real-time communication protocol for updates.

### Frontend

- **React**: Component-based library for building the user interface.
- **WebSocket**: Real-time communication for client-server updates.

## Folder Structure

```
backend/
  |- node_modules/         # Backend dependencies
  |- .gitignore            # Ignored files and folders
  |- customerWorker.js     # Handles customer interactions with the ticket system
  |- vendorWorker.js       # Manages vendor ticket submissions
  |- TicketPool.js         # Core logic for ticket handling
  |- main.js               # Entry point for the backend server
  |- package.json          # Backend dependencies and scripts
  |- package-lock.json     # Lockfile for consistent dependency resolution

frontend/
  |- node_modules/         # Frontend dependencies
  |- public/               # Static assets
  |- src/
      |- access/           # Access control components
      |- Alert.js          # UI component for alerts and notifications
      |- App.js            # Main application file
      |- App.css           # Styles for the application
      |- ConfigForm.js     # Configuration form for user inputs
      |- index.js          # Entry point for the React application
  |- .gitignore            # Ignored files and folders
  |- package.json          # Frontend dependencies and scripts
  |- package-lock.json     # Lockfile for consistent dependency resolution
  |- README.md             # Project documentation (current file)
```

## Installation and Setup

### Prerequisites

- **Node.js** (v14 or later)
- **npm** (v6 or later)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node main.js
   ```
   The backend server will run on `http://localhost:3000` by default.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be accessible at `http://localhost:3000` by default.

## How to Use

### Vendor Actions

- Vendors can add tickets to the system at a fixed rate.
- Ticket submissions are handled by the backend `vendorWorker.js` logic.

### Customer Actions

- Customers can fetch available tickets in real-time.
- Ticket retrieval logic is managed by `customerWorker.js`.

### Real-Time Updates

- WebSocket ensures that ticket additions and retrievals are synchronized in real-time.
