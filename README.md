# 🌱 Plant Care - Server

Plant Care Server is the backend API service for the Plant Care platform. It provides RESTful APIs for storing, viewing, updating, and deleting plant information using MongoDB and Express.js.

---
Fully Responsive for Mobile, Tablet & Desktop

Client site: [Plant Care Client](https://github.com/Mezbahul-241-15-929/plantcare)

Server site: [Plant Care Server](https://github.com/Mezbahul-241-15-929/plantcare-server)

Live site: [Plant Care Live](https://plantcareclient.netlify.app/)

## 📖 Project Description

The Plant Care backend manages plant data and connects the frontend application with MongoDB. It provides a simple and scalable API for plant CRUD operations, input validation, error handling, and deployment through Vercel.

The server is designed with simplicity, maintainability, and serverless deployment in mind.

---

## ✨ Features

### 🌿 Plant Management APIs
- Get All Plants
- Get a Single Plant
- Add a New Plant
- Update Plant Information
- Delete a Plant
- Validate Plant IDs

### 🔒 Security and Configuration
- Secure MongoDB connection
- CORS configuration
- Environment variable support
- Centralized error handling
- MongoDB credentials kept outside source control

### ⚡ Database Operations
- Create plant records
- Read plant records
- Update plant records
- Delete plant records
- Reuse MongoDB connections for serverless requests

### 🌐 REST API Architecture
- Express.js REST endpoints
- JSON request and response handling
- Health check endpoint
- Vercel-compatible server export

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check that the API is running |
| GET | `/health` | Check API health |
| GET | `/plants` | Get all plants |
| GET | `/plants/:id` | Get one plant by ID |
| POST | `/plants` | Add a new plant |
| PUT | `/plants/:id` | Update a plant |
| DELETE | `/plants/:id` | Delete a plant |

---

## ⚙️ Local Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file with your MongoDB configuration:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=plantDB
MONGODB_COLLECTION=coffees
```

Start the server:

```bash
npm start
```

The API runs locally at:

```text
http://localhost:3000
```

---

## 🚀 Deployment

This server is configured for Vercel deployment:

```bash
vercel --prod
```

Add `MONGODB_URI` to the Vercel production environment variables before deploying.

---

## 👨‍💻 Created By

**Md. Mezbahul Islam**

---

© 2026 Plant Care Server. All Rights Reserved.
