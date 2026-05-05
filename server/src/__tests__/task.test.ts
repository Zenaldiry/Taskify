import request from 'supertest';
import dotenv from 'dotenv';
import { setDataBaseBeforeAndAfterTests } from './helper';
import app from '../app';
import { registerNewUser } from './helper';
dotenv.config();
jest.setTimeout(60000);
setDataBaseBeforeAndAfterTests();
describe('Task API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should fetch all tasks for the logged-in user', async () => {
      const cookies = await registerNewUser(app);

      await request(app).post('/api/tasks').set('Cookie', cookies).send({
        title: 'Task to Fetch',
        priority: 'medium',
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe('Task to Fetch');
    });
  });
  describe('POST /api/tasks', () => {
    it('should create a new task and return 201', async () => {
      const cookies = await registerNewUser(app);
      const response = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'NEW TASK',
          description: 'THIS IS A NEW TASK',
          priority: 'high',
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('NEW TASK');
      expect(response.body.description).toBe('THIS IS A NEW TASK');
      expect(response.body.priority).toBe('high');
    });
  });
  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const cookies = await registerNewUser(app);

      const createRes = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Old Title',
          status: 'todo',
        });
      const taskId = createRes.body._id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Cookie', cookies)
        .send({
          title: 'New Title',
          status: 'in-progress',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('New Title');
      expect(response.body.status).toBe('in-progress');
    });
  });
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const cookies = await registerNewUser(app);
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Cookie', cookies)
        .send({
          title: 'Task to Delete',
        });
      const taskId = createRes.body._id;

      const deleteRes = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Cookie', cookies);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toBe('Task deleted');

      const getRes = await request(app)
        .get('/api/tasks')
        .set('Cookie', cookies);
      expect(getRes.body.length).toBe(0);
    });
  });
});
