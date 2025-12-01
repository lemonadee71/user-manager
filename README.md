# User Manager

A simple full-stack User Management Dashboard showcasing CRUD operations with search and filtering

## 🗒️ Description

This project shows a basic user management system where you can:

- View all users
- Search and filter users
- Create new users
- Update existing users
- Delete users

It serves as an example of connecting a React frontend to an Express backend while performing read/write operations on a JSON file.

## 📂 Project Structure

```
/backend                -> Express server + JSON db
└── src
    ├── db              -> Location of JSON db
    ├── controllers     -> Request handlers
    ├── services        -> Business logic
    ├── models          -> Schemas
    ├── routes          -> API endpoints
    ├── tests           -> Unit tests
    └── lib             -> Utilities
/frontend               -> React Application
├── src
│   ├── components
│   ├── lib             -> Utilities
│   └── types
└── App.tsx             -> Entry point; main app
```

## 🚀 Getting Started

Below are the steps from cloning the repository to running the the application

### 1️⃣ Clone the repository

```bash
git clone https://github.com/lemonadee71/user-manager.git
cd user-manager
```

### 2️⃣ Install dependencies

```bash
npm run install:all
```

### 3️⃣ Start the application (dev mode)

```bash
npm run dev
```

Backend will run on http://localhost:3000

> You can change the port by creating `backend/.env` and adding `PORT=<port>`

Frontend will run on http://localhost:5173

> If you change the port of the backend, you must create an `.env.local` file on `frontend` folder and add `VITE_PUBLIC_API_URL='http://127.0.0.1:<port>'` or change the fallback on `frontend/src/lib/constants.ts`

## 📸 Screenshots

![Landing Page](https://i.imgur.com/D1wN5GH.png)

![Search](https://i.imgur.com/LovLb4n.png)

![Create User](https://i.imgur.com/pP5wJy7.png)

![Edit User](https://i.imgur.com/hzJg8Hz.png)

## 📌 Notes

- Both frontend and backend use npm run dev for development.
- Data is stored in **backend/db/user.json** and is read/written on every CRUD operation.
