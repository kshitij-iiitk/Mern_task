# MERN Stack Project

## Installation & Setup

Follow these steps to set up and run the project locally.

### Clone the Repository
```sh
git clone https://github.com/kshitij-iiitk/Mern_task.git
cd Mern_task
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
JWTPRIVATEKEY=<same-secrect-key>
```

## Features
- Admin User Login
- Agent Creation & Management
- Uploading & Distributing Lists

## Tech Stack
- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** MongoDB
