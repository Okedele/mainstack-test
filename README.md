# Banking Transactions API

## Overview
A banking ledger system that handles financial transactions with **ACID compliance** and **double-entry accounting** using **MongoDB transactions**.

## Features
- User account management
- Multi-currency support
- Credit, Debit, and account-to-account transfers
- Transaction history tracking
- Token-based authentication (JWT)
- Input validation and sanitization
- Fully documented API (Postman)
- Unit tests for all functionalities
- Docker containerization

## Tech Stack
- **Node.js** (Runtime)
- **Express** (Web Framework)
- **TypeScript** (Static Typing)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Express Validator** (Input Validation)
- **Helmet** (Security)
- **JWT** (Authentication)
- **Docker** (Containerization)

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Okedele/mainstack-test
   cd mainstack-test
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   Update `.env` with your database and authentication settings.

### Running the API Locally
1. Start MongoDB (if not using Docker):
   ```sh
   mongod --dbpath /path/to/db
   ```
2. Run the API:
   ```sh
   npm run start
   ```
3. API will be available at: `http://localhost:${PORT}`

### Running with Docker
1. Build and start containers:
   ```sh
   docker-compose up -d
   ```
2. Verify running containers:
   ```sh
   docker ps
   ```

---

## API Documentation

### Authentication
- **POST** `/api/auth/register` - Create a new user (Validated with express-validator)
- **POST** `/api/auth/login` - Authenticate user and get JWT token (Validated with express-validator)

### Accounts
- **POST** `/api/accounts` - Create a new account for the authenticated user (Validated with express-validator)
- **GET** `/api/accounts` - List all accounts for the authenticated user
- **GET** `/api/accounts/:id` - Get account details

### Transactions
- **POST** `/api/transaction/credit` - Credits user account (Validated with express-validator)
- **POST** `/api/transaction/debit` - Debits user account (Validated with express-validator)
- **POST** `/api/transaction/transfer` - Transfer funds between accounts (Validated with express-validator)
- **GET** `/api/transactions` - Get transactions for authenticated user with pagination and other queries
- **GET** `/api/transactions/:id` - Get a transaction details for the authenticated user

Full API documentation is available in the [Postman collection](https://documenter.getpostman.com/view/11894058/2sB2cRDQBz).

---

## Input Validation & Security
- **Express-validator** is used for request validation.
- **Helmet** is used for security best practices.
- **CORS** is enabled with proper configurations.

---

## Running Tests
Run unit tests using:
```sh
npm run test
```

---

## Deployment
1. **Build for production**:
   ```sh
   npm run build
   ```
2. **Run with PM2** (recommended for production):
   ```sh
   pm2 start dist/index.js --name banking-api
   ```

---

