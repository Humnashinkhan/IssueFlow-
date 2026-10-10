# IssueFlow

A small full-stack issue tracker built with the MERN stack. Users can register, log in, and create, search, filter, update and delete software issues (bugs, features, improvements and tasks), with a dashboard that shows live statistics.

I built this as my technical assignment for the Software Engineer Intern (MERN Stack) role.

## Features

- User registration and login with JWT authentication and bcryptjs password hashing
- Protected routes on both the API and the React app
- Issue CRUD: create, view, edit and delete issues
- Issue fields: title, description, status, priority, type, creator and timestamps
- Search by title, filter by status, priority and type, sort by date
- Backend pagination
- Dashboard with total, open, in progress, resolved, closed and high priority counts, calculated with a MongoDB aggregation, plus recent issues
- Issue details page with edit, delete and quick status update
- Authorization: any logged-in user can view issues, but only the creator can edit or delete them (the server returns 403 otherwise)
- Loading, empty and error states, plus form validation errors
- Responsive UI built with Tailwind CSS

## Technologies Used

**Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS v4

**Backend:** Node.js, Express 5, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, dotenv, cors

**Tools:** Git, GitHub, MongoDB Atlas, Thunder Client (API testing), Kiro (AI tool)

## Project Structure

```
IssueFlow/
├── client/                  React app (Vite)
│   └── src/
│       ├── components/      Reusable UI (Navbar, IssueForm, Modal, Badges...)
│       ├── context/         AuthProvider (global auth state)
│       ├── hooks/           useAuth
│       ├── layouts/         AppLayout (navbar + page frame)
│       ├── pages/           Login, Register, Dashboard, Issues, IssueDetails
│       ├── services/        Axios instance and API functions
│       └── utils/           Constants, formatters, error helper, token helper
└── server/                  Express API
    └── src/
        ├── config/          Database connection
        ├── controllers/     Request handlers
        ├── middleware/      Auth (protect) and error handling
        ├── models/          User and Issue schemas
        ├── routes/          Route definitions
        ├── services/        Query building and dashboard aggregation
        ├── utils/           Token generation, validators, constants
        ├── app.js           Express app setup
        └── server.js        Entry point (connects DB, then listens)
```

## Database Models

**User:** `name`, `email` (unique), `password` (hashed, never returned in responses), `createdAt`, `updatedAt`

**Issue:** `title`, `description`, `status` (Open, In Progress, Resolved, Closed), `priority` (Low, Medium, High), `type` (Bug, Feature, Improvement, Task), `createdBy` (reference to User), `createdAt`, `updatedAt`

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a user |
| POST | `/api/auth/login` | No | Log in and receive a token |
| GET | `/api/auth/me` | Yes | Get the current user |
| POST | `/api/issues` | Yes | Create an issue |
| GET | `/api/issues` | Yes | List issues (filters and pagination) |
| GET | `/api/issues/:id` | Yes | Get one issue |
| PUT | `/api/issues/:id` | Yes (creator only) | Update an issue (partial updates allowed) |
| DELETE | `/api/issues/:id` | Yes (creator only) | Delete an issue |
| GET | `/api/dashboard/stats` | Yes | Dashboard statistics |

**Query parameters for `GET /api/issues`:** `search`, `status`, `priority`, `type`, `sort` (`newest` or `oldest`), `page`, `limit` (max 50)

Example: `GET /api/issues?status=Open&priority=High&page=1&limit=10`

## Environment Variables

**`server/.env`** (copy from `server/.env`)

```
SERVER_PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**`client/.env`** (copy from `client/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

Real `.env` files are not committed.

## Setup and Installation

Requirements: Node.js 20 or newer, and a MongoDB database (a free MongoDB Atlas cluster works).

```bash
git clone [YOUR-GITHUB-REPO-URL]
cd IssueFlow

# Backend
cd server
npm install
cp .env.example .env     # then fill in your values

# Frontend
cd ../client
npm install
cp .env.example .env
```

On Windows, copy the `.env.example` files manually if `cp` is not available.

## How to Run

Open two terminals.

```bash
# Terminal 1: backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2: frontend (http://localhost:5173)
cd client
npm run dev
```

Open `http://localhost:5173`, register an account and start creating issues. To test the authorization rule, register a second user and check that they can see the first user's issues but cannot edit or delete them.

## AI Development Tool

**Kiro**
## AI Development Experience
I used Kiro for 3 specific tasks such as Task 1: Delete confirmation modal (component development), Task 2: Extract a useIssues hook (refactoring),
Task 3: Backend tests (testing), For each one
I gave Kiro the relevant existing files and a focused prompt, reviewed the
generated code before accepting it, and tested the result in the browser or
with the API.

I also used Claude as a guide throughout the project. It helped me plan the
architecture and walked me through most of the backend and frontend code step
by step. I created the files myself, ran every test, and fixed the setup
problems I ran into (listed under Challenges and Solutions). I studied each
part so I can explain it.


## Challenges and Solutions

**1. MongoDB Atlas connection failed with an SSL error.**
Registering a user returned a 500 with `SSL alert number 80`, and the request took about 30 seconds. The code was fine. My current IP address was not allowed in Atlas. I added my IP under Network Access, restarted the server, and registration worked.

**2. Registration returned 404 from the React app.**
The browser requests went to `localhost:5173/auth/register` instead of the API. `VITE_API_URL` was not being read because Vite only reads `.env` when it starts, and I had created the file while the dev server was running. I restarted the dev server, and the requests went to `localhost:5000/api/auth/register`.

**3. Postman could not reach my local server.**
Postman's web version uses a cloud agent that cannot access `localhost`, so I got "Couldn't resolve host". I switched to the Thunder Client extension in VS Code, which runs on my own machine.

**4. Keeping the password out of API responses.**
`select: false` only hides the password from queries. A freshly created document still contains it in memory, so I added a `toJSON` transform on the User model that removes the password before responses are sent.

**5. Unsafe input.**
I validate that request values are strings, which blocks NoSQL injection such as `{"email": {"$gt": ""}}`, and I escape the search text before using it in a regex so special characters cannot crash the query.

[Add any other real problems you hit while testing, and what caused them.]

## Notes and Known Limitations

- Logout only removes the token on the client, because JWTs are stateless. The token stays valid until it expires (7 days).
- The token is stored in `localStorage`. This is simple but exposed to XSS. An httpOnly cookie would be safer.
- Dashboard statistics are global because issues are shared between all users.
- `PUT` accepts partial updates, which is closer to `PATCH` behavior.

## Future Improvements

These are not implemented yet:

- Comments on issues
- Labels and assignees
- Filters stored in the URL so views can be shared
- Rate limiting on login and register
- Automated backend tests
