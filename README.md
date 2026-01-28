## **2️⃣ Frontend README (`Sensing Engine/demand_dashboard/README.md`)**

```markdown
# Sensing Engine - Frontend

## Description
This is the frontend of the **Sensing Engine** project built with **React + Vite + TypeScript**.  
It provides a dashboard interface for demand forecasting, trends, and analytics.

## Folder Structure
demand_dashboard/
│
├── src/
│ ├── api/ # API calls
│ ├── components/ # Reusable React components
│ ├── hooks/ # Custom React hooks
│ ├── lib/ # Utility functions
│ ├── pages/ # Page components
│ ├── App.tsx
│ ├── main.tsx
│ └── ...other files
├── public/ # Static assets
├── package.json # Project configuration
├── tsconfig.json # TypeScript configuration
├── .env.example # Example environment variables
└── README.md


## Installation

1. **Install Node.js dependencies:**
```bash
npm install
Run the development server:

npm run dev
Server will start on http://localhost:5173 (or another port if specified)

Environment Variables
Rename .env.example to .env and provide real API URL:

VITE_API_URL=http://localhost:8000
This points the frontend to the backend server.

Notes
node_modules/ and dist/ are ignored in version control.

Build for production:

npm run build
After build, the dist/ folder can be deployed to any static hosting.