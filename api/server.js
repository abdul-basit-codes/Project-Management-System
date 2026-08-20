/**
 * Project Management System API — Vercel Serverless Function
 * In-memory storage with projects, tasks, and members.
 * Frontend falls back to localStorage if the API is unavailable.
 */

let store = null;

function initStore() {
  if (!store) {
    store = {
      projects: [
        { id: 1, name: 'Website Redesign', description: 'Refresh the company website', status: 'active', progress: 60, createdAt: '2026-07-01' },
        { id: 2, name: 'Mobile App Launch', description: 'Ship the iOS and Android apps', status: 'planning', progress: 20, createdAt: '2026-07-15' },
      ],
      tasks: [
        { id: 1, projectId: 1, title: 'Design wireframes', assignee: 'Ayesha', priority: 'high', status: 'done', due: '2026-07-20' },
        { id: 2, projectId: 1, title: 'Homepage build', assignee: 'Bilal', priority: 'medium', status: 'in-progress', due: '2026-08-01' },
        { id: 3, projectId: 2, title: 'Set up CI/CD', assignee: 'Daniyal', priority: 'low', status: 'in-progress', due: '2026-08-10' },
      ],
      members: [
        { id: 1, name: 'Ayesha', role: 'Designer' },
        { id: 2, name: 'Bilal', role: 'Developer' },
        { id: 3, name: 'Daniyal', role: 'Developer' },
      ],
    };
  }
}

function send(res, status, body) {
  res.status(status).json(body);
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  initStore();
  const url = (req.url || '/').split('?')[0];
  const segments = url.split('/').filter(Boolean);

  // Health / root
  if (req.method === 'GET' && (segments.length === 0 || segments[0] === 'server')) {
    return send(res, 200, {
      success: true,
      message: 'Project Management System API is running',
      version: '1.1.0',
      endpoints: {
        projects: 'GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id',
        tasks: 'GET/POST /api/tasks, GET/PUT/DELETE /api/tasks/:id',
        members: 'GET /api/members',
      },
    });
  }

  // Tasks that are not done and past their due date
  if (req.method === 'GET' && segments[0] === 'tasks' && segments[1] === 'overdue') {
    const today = new Date().toISOString().slice(0, 10);
    const overdue = store.tasks.filter(
      (t) => t.status !== 'done' && t.due && t.due < today
    );
    return send(res, 200, { success: true, count: overdue.length, data: overdue });
  }

  // Task search: GET /tasks/search?q=title  (filters by title/assignee/status)
  if (req.method === 'GET' && segments[0] === 'tasks' && segments[1] === 'search') {
    const params = new URLSearchParams((req.url || '').split('?')[1] || '');
    const q = (params.get('q') || '').toLowerCase().trim();
    const status = (params.get('status') || '').toLowerCase().trim();
    const results = store.tasks.filter((t) => {
      const matchQ = !q ||
        (t.title || '').toLowerCase().includes(q) ||
        (t.assignee || '').toLowerCase().includes(q) ||
        (t.status || '').toLowerCase().includes(q);
      const matchStatus = !status || t.status === status;
      return matchQ && matchStatus;
    });
    return send(res, 200, { success: true, count: results.length, data: results });
  }

  const collection = segments[0];
  const isView = () => (req.method === 'GET' && segments.length === 1);
  const isOne = () => segments.length === 2 && /^\d+$/.test(segments[1]);
  const id = () => Number(segments[1]);

  // Dashboard summary counts
  if (req.method === 'GET' && segments[0] === 'summary') {
    const tasks = store.tasks;
    const today = new Date().toISOString().slice(0, 10);
    return send(res, 200, {
      success: true,
      data: {
        projects: store.projects.length,
        tasks: tasks.length,
        members: store.members.length,
        done: tasks.filter((t) => t.status === 'done').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        highPriority: tasks.filter((t) => t.priority === 'high').length,
        overdue: tasks.filter((t) => t.status !== 'done' && t.due && t.due < today).length,
      },
    });
  }

  const lists = {
    projects: () => store.projects,
    tasks: () => store.tasks,
    members: () => store.members,
  };

  if (!lists[collection]) {
    return send(res, 404, { success: false, message: 'Unknown resource' });
  }

  const list = lists[collection]();

  // GET /api/:collection  and  GET /api/:collection/:id
  if (req.method === 'GET') {
    if (isView()) {
      return send(res, 200, { success: true, data: list });
    }
    if (isOne()) {
      const item = list.find((x) => x.id === id());
      return item ? send(res, 200, { success: true, data: item })
                  : send(res, 404, { success: false, message: 'Not found' });
    }
  }

  // POST /api/:collection  (create)
  if (req.method === 'POST' && isView()) {
    const body = req.body || {};
    const nextId = list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
    const item = { id: nextId, ...body };
    list.push(item);
    return send(res, 201, { success: true, data: item });
  }

  // PUT /api/:collection/:id  (replace)
  if (req.method === 'PUT' && isOne()) {
    const index = list.findIndex((x) => x.id === id());
    if (index === -1) {
      return send(res, 404, { success: false, message: 'Not found' });
    }
    list[index] = { ...list[index], ...(req.body || {}), id: id() };
    return send(res, 200, { success: true, data: list[index] });
  }

  // DELETE /api/:collection/:id
  if (req.method === 'DELETE' && isOne()) {
    const index = list.findIndex((x) => x.id === id());
    if (index === -1) {
      return send(res, 404, { success: false, message: 'Not found' });
    }
    list.splice(index, 1);
    return send(res, 200, { success: true, deleted: true });
  }

  return send(res, 405, { success: false, message: 'Method not allowed' });
};
