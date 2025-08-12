import { createServer } from 'node:http';
import { parse } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const DATA_FILE = new URL('./data.json', import.meta.url);
let db = { courses: [], progress: [], certificates: [] };
if (existsSync(DATA_FILE)) {
  db = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}
function saveDb() {
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-role',
  });
  res.end(JSON.stringify(data));
}
function notFound(res) {
  send(res, 404, { error: 'Not found' });
}
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}
function requireAdmin(req, res) {
  if (req.headers['x-role'] !== 'admin') {
    send(res, 403, { error: 'Forbidden' });
    return false;
  }
  return true;
}

const server = createServer(async (req, res) => {
  const urlObj = parse(req.url || '', true);
  const { pathname } = urlObj;
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, x-role',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    });
    return res.end();
  }

  // GET /api/courses
  if (pathname === '/api/courses' && method === 'GET') {
    return send(res, 200, db.courses);
  }

  // POST /api/courses (admin)
  if (pathname === '/api/courses' && method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const course = await parseBody(req);
      if (!course.title || !course.description || !course.category || !Array.isArray(course.lessons)) {
        return send(res, 400, { error: 'Invalid course' });
      }
      const newCourse = { ...course, id: randomUUID(), progress: 0, completed: false };
      db.courses.push(newCourse);
      saveDb();
      return send(res, 201, newCourse);
    } catch (e) {
      return send(res, 400, { error: 'Invalid JSON' });
    }
  }

  // PATCH /api/courses/:id (admin)
  if (pathname?.startsWith('/api/courses/') && method === 'PATCH') {
    const parts = pathname.split('/');
    if (parts.length === 4) {
      const id = parts[3];
      if (!requireAdmin(req, res)) return;
      try {
        const update = await parseBody(req);
        const course = db.courses.find(c => c.id === id);
        if (!course) return notFound(res);
        Object.assign(course, update);
        saveDb();
        return send(res, 200, course);
      } catch (e) {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    }
    if (parts.length === 7 && parts[4] === 'lessons' && parts[6] === 'progress') {
      // PATCH /api/courses/:courseId/lessons/:lessonId/progress
      const courseId = parts[3];
      const lessonId = parts[5];
      try {
        const { userId } = await parseBody(req);
        if (!userId) return send(res, 400, { error: 'userId required' });
        const course = db.courses.find(c => c.id === courseId);
        if (!course) return notFound(res);
        let record = db.progress.find(p => p.userId === userId && p.courseId === courseId);
        if (!record) {
          record = { userId, courseId, completedLessons: [], progress: 0, completed: false };
          db.progress.push(record);
        }
        if (!record.completedLessons.includes(lessonId)) {
          record.completedLessons.push(lessonId);
        }
        const completedLessons = record.completedLessons.length;
        record.progress = Math.round((completedLessons / course.lessons.length) * 100);
        if (record.progress === 100) record.completed = true;
        saveDb();
        return send(res, 200, { progress: record.progress, completed: record.completed });
      } catch (e) {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    }
  }

  // POST /api/courses/:id/certificates
  if (pathname?.startsWith('/api/courses/') && pathname.endsWith('/certificates') && method === 'POST') {
    const parts = pathname.split('/');
    if (parts.length === 5) {
      const courseId = parts[3];
      try {
        const { userId, score } = await parseBody(req);
        if (!userId) return send(res, 400, { error: 'userId required' });
        const course = db.courses.find(c => c.id === courseId);
        if (!course) return notFound(res);
        const certId = randomUUID();
        const cert = {
          id: certId,
          userId,
          courseId,
          courseName: course.title,
          completedAt: new Date().toISOString(),
          score,
        };
        db.certificates.push(cert);
        const record = db.progress.find(p => p.userId === userId && p.courseId === courseId);
        if (record) record.certificateId = certId;
        saveDb();
        return send(res, 201, { id: certId });
      } catch (e) {
        return send(res, 400, { error: 'Invalid JSON' });
      }
    }
  }

  // GET /api/progress/:userId
  if (pathname?.startsWith('/api/progress/') && method === 'GET') {
    const userId = pathname.split('/')[3];
    const userProgress = db.progress.filter(p => p.userId === userId);
    return send(res, 200, userProgress);
  }

  notFound(res);
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
