# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-08-14

### Added
- In-memory CRUD API for projects, tasks, and members (GET/POST/PUT/DELETE)
- Seed data for projects, tasks, and team members
- API endpoint documentation in README

### Changed
- Health endpoint reports version `1.1.0`

## [1.0.0] - 2026-07-24

### Added
- Dashboard with real-time stats (total tasks, completed, in progress, high priority, overdue)
- Project management with progress bars and task counts
- Full task CRUD with title, description, project, assignee, status, priority, due date
- Kanban board with drag-and-drop task movement across To Do / In Progress / Review / Done
- Team member management with name, role, email
- localStorage persistence for offline-first operation
- Vercel serverless API endpoint
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Responsive design for mobile devices
- Dark theme UI
