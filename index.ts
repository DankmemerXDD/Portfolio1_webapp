import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(__dirname, 'eksempel_data.json');

const app = new Hono();

app.use('*', (c, next) => {
  c.res.headers.set('Access-Control-Allow-Origin', '*');
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  if (c.req.method === 'OPTIONS') {
    return c.text('OK', 204); // Handle preflight requests
  }
  return next();
});

async function readData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData(data) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write data:', error);
  }
}

// Get projects
app.get('/projects', async (c) => {
  const data = await readData();
  return c.json(data);
});

// Add new project
app.post('/projects', async (c) => {
  const newProject = await c.req.json();
  const data = await readData();
  data.push(newProject);
  await writeData(data);
  return c.json(data);
});

// Delete a project
app.delete('/projects/:index', async (c) => {
  const index = parseInt(c.req.param('index'));
  const data = await readData();
  
  if (index >= 0 && index < data.length) {
    data.splice(index, 1); // Remove the project at the given index
    await writeData(data);
    return c.json({ message: 'Project deleted', data });
  } else {
    return c.json({ message: 'Invalid index' }, 400);
  }
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
