module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: null,
      message: 'Project Management System API is running',
      version: '1.0.0',
      endpoints: {
        health: 'GET /api/server',
        projects: 'Coming soon',
        tasks: 'Coming soon'
      }
    });
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
