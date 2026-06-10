# Job Application Tracker
![React Native](https://img.shields.io/badge/React%20Native-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![Expo](https://img.shields.io/badge/Expo-Cross--Platform-black)

A full-stack job application tracking platform designed to help users manage applications, interviews, and hiring progress in one centralized system.

This project was created to strengthen and demonstrate full-stack software engineering skills, including authentication, REST API design, database integration, cross-platform frontend development, and state management.

The application supports both mobile and web platforms using React Native with Expo and includes a Node.js + Express backend with MySQL for persistent data storage.

---

## Why I Built This

I built this project to strengthen my full-stack software engineering skills while creating a practical application that I could use personally during my job search.

The project focuses on backend API development, authentication, database design, frontend architecture, reusable components, state management, and cross-platform mobile/web support using React Native and Expo.

---

## Features

* User authentication with JWT
* Secure protected API routes
* Create, edit, and delete job applications
* Create, edit, and delete interviews
* Associate interviews with specific jobs
* Weekly interview calendar dashboard
* Search and filter job applications
* Cross-platform support (mobile + web)
* Client-side and server-side validation
* React Query caching and mutation handling
* Reusable form and UI component architecture
* Consistent responsive UI styling
* Password hashing with bcrypt
* Token-based authentication and authorization
* Centralized backend validation middleware

---

## Tech Stack

### Frontend

* React Native
* Expo
* React Navigation
* TanStack React Query
* Axios
* React Native Toast Message

### Backend

* Node.js
* Express.js
* JavaScript
* bcrypt

### Database

* MySQL
* mysql2

---

## Project Structure

```text
job-application-tracker/
│
├── backend/
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── utils
│
└── frontend/
    ├── src/
    │   ├── api
    │   ├── components
    │   ├── constants
    │   ├── context
    │   ├── hooks
    │   ├── navigation
    │   ├── screens
    │   ├── theme
    │   └── utils
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/JJones3447/job-application-tracker.git
cd job-application-tracker
```

---

## Backend Setup

### Navigate to backend

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Create backend `.env`

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
PORT=
```

### Start backend server

```bash
npm start
```

---

## Frontend Setup

### Navigate to frontend

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Create frontend `.env`

```env
EXPO_PUBLIC_API_URL=
```

### Start Expo

```bash
npx expo start
```

---

## API Overview

### Authentication Routes

| Method | Route                      | Description            |
| ------ | -------------------------- | ---------------------- |
| POST   | `/authentication/register` | Register new user      |
| POST   | `/authentication/login`    | Login user             |
| GET    | `/authentication/me`       | Get authenticated user |

---

### Job Routes

| Method | Route           | Description    |
| ------ | --------------- | -------------- |
| GET    | `/api/jobs`     | Get all jobs   |
| POST   | `/api/jobs`     | Create job     |
| GET    | `/api/jobs/:id` | Get single job |
| PUT    | `/api/jobs/:id` | Update job     |
| DELETE | `/api/jobs/:id` | Delete job     |

---

### Interview Routes

| Method | Route                 | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/interviews`     | Get all interviews   |
| GET    | `/api/interviews/:id` | Get single interview |
| PUT    | `/api/interviews/:id` | Update interview     |
| DELETE | `/api/interviews/:id` | Delete interview     |

---

### Job Interview Routes

| Method | Route                         | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/api/jobs/:jobID/interviews` | Get interviews for job   |
| POST   | `/api/jobs/:jobID/interviews` | Create interview for job |

---

## Database Design

The application uses a relational MySQL database consisting of three primary tables:

* `User`
* `Job`
* `Interview`

The schema was designed to support authenticated users, job tracking, and interview management while maintaining clear relational connections between entities.

---

### User Table

Stores authentication and account information for each registered user.

| Column         | Type         | Description                     |
| -------------- | ------------ | ------------------------------- |
| `userID`       | INT (PK, AI) | Unique identifier for each user |
| `name`         | VARCHAR(100) | User's full name                |
| `email`        | VARCHAR(255) | User email address              |
| `passwordHash` | VARCHAR(255) | Hashed password using bcrypt    |
| `createdAt`    | DATETIME     | Timestamp of account creation   |

---

### Job Table

Stores all job applications created by users.

| Column            | Type         | Description                      |
| ----------------- | ------------ | -------------------------------- |
| `jobID`           | INT (PK, AI) | Unique identifier for each job   |
| `companyName`     | VARCHAR(100) | Company name                     |
| `jobTitle`        | VARCHAR(100) | Position title                   |
| `listedSalary`    | VARCHAR(50)  | Salary listed in the posting     |
| `location`        | VARCHAR(100) | Job location                     |
| `technologies`    | TEXT         | Technologies related to the role |
| `jobURL`          | VARCHAR(255) | Link to the original job posting |
| `applicationDate` | DATE         | Date the user applied            |
| `status`          | ENUM         | Current application status       |
| `notes`           | TEXT         | Additional notes about the job   |
| `userID`          | INT (FK)     | References the owning user       |

#### Job Status Enum Values

* Applied
* Interviewing
* Rejected
* Offer
* Accepted

---

### Interview Table

Stores interviews associated with job applications.

| Column           | Type         | Description                          |
| ---------------- | ------------ | ------------------------------------ |
| `interviewID`    | INT (PK, AI) | Unique identifier for each interview |
| `jobID`          | INT (FK)     | Associated job application           |
| `interviewDate`  | DATETIME     | Scheduled interview date and time    |
| `interviewType`  | ENUM         | Type of interview                    |
| `interviewNotes` | TEXT         | Notes related to the interview       |
| `result`         | ENUM         | Interview outcome                    |
| `userID`         | INT (FK)     | References the owning user           |

#### Interview Type Enum Values

* Phone
* Technical
* HR
* Behavioral
* On-site
* Other

#### Interview Result Enum Values

* Pending
* Passed
* Failed
* Offer Extended

---

### Relationships

The database follows a one-to-many relational structure:

* One `User` can have many `Jobs`
* One `Job` can have many `Interviews`
* Each `Interview` belongs to a single `Job`
* Each `Job` belongs to a single `User`

This relational structure allows secure user-specific data ownership while supporting efficient querying and scalable application growth.


## Screenshots

Screenshots coming soon.


---

## Future Improvements

* Interview reminders and notifications
* Resume upload support
* Company analytics dashboard
* Advanced filtering and sorting
* Search persistence
* Calendar enhancements
* Email notifications
* Dark/light mode toggle
* Pagination and infinite scrolling
* Docker containerization

---

## What I Learned

This project helped strengthen my understanding of:

* Full-stack application architecture
* REST API development
* JWT authentication flows
* Protected routes and authorization
* React Query caching and mutations
* Cross-platform UI development with React Native
* Relational database design with MySQL
* Form validation patterns
* State management and reusable hooks
* Component-based frontend architecture and reusable UI patterns
* Error handling across frontend and backend systems

---

## Author

Built by Joshua Jones.
