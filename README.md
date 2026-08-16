# Project Management System

Full-stack project management system with task tracking, team management, and Kanban board.

## Features

- **Dashboard** — Real-time stats, overdue tracking, task summary
- **Projects** — Create, track progress with visual bars
- **Tasks** — Full CRUD with priority, status, assignee, due dates
- **Kanban Board** — Drag-and-drop task movement across columns
- **Team** — Member management with roles
- **Offline-first** — localStorage fallback when API is unavailable

## Tech Stack

- **Frontend:** Vanilla HTML/CSS/JS (no framework dependencies)
- **Backend:** Node.js Vercel Serverless Function
- **Deployment:** Vercel (Framework: "Other")

## API

The serverless endpoint (`/api/server`) exposes full CRUD for `projects`, `tasks`, and `members`:

| Method | Route                            | Description              |
|--------|----------------------------------|--------------------------|
| GET    | /api/server                      | Health check + endpoints |
| GET    | /api/projects                    | List projects            |
| POST   | /api/projects                    | Create a project         |
| GET    | /api/projects/:id                | Get one project          |
| PUT    | /api/projects/:id                | Update a project         |
| DELETE | /api/projects/:id                | Delete a project         |
| GET    | /api/tasks                       | List tasks               |
| POST   | /api/tasks                       | Create a task            |
| PUT    | /api/tasks/:id                   | Update a task            |
| DELETE | /api/tasks/:id                   | Delete a task            |
| GET    | /api/members                     | List team members        |
| GET    | /api/summary                     | Dashboard counts         |
| GET    | /api/tasks/overdue               | Overdue tasks            |

Example:

```sh
curl http://localhost:3000/api/summary
curl http://localhost:3000/api/tasks/overdue
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"projectId":1,"title":"Write tests","status":"todo"}'
```

Data is held in memory and resets on cold start; the frontend keeps its own
localStorage copy so it works offline too.

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Set Framework Preset to **Other**
4. Deploy

## Local Development

Open `index.html` in a browser — works fully offline via localStorage.

## License

MIT
