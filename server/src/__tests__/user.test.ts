import request from 'supertest';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/userModel';
import { setDataBaseBeforeAndAfterTests } from './helper';
dotenv.config();
jest.setTimeout(60000);

setDataBaseBeforeAndAfterTests();

describe('User API Endpoints', () => {
  describe('POST /api/users', () => {
    it('should register a new user and return 201', async () => {
      const response = await request(app).post('/api/users').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test User');
      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should not allow duplicate emails', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/users').send({
        name: 'New User',
        email: 'test@example.com',
        password: 'newpassword123',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });
  });
});
