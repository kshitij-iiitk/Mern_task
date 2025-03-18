# MERN Stack Project

## Installation & Setup

Follow these steps to set up and run the project locally.

### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB (Local or Cloud Instance)
- Git (Optional but recommended)

### Clone the Repository
```sh
git clone <your-repository-url>
cd <your-project-folder>
```

### Install and Run the Client
```sh
cd client
npm install
npm start
```

### Install and Run the Server
```sh
cd server
npm install
npm start
```

## Environment Variables
Create a `.env` file in the `server` directory and configure the following variables:
```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
```

## Features
- Admin User Login
- Agent Creation & Management
- Uploading & Distributing Lists

## Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
