import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
export const registerNewUser = async (app: Express) => {
  const authRes = await request(app).post('/api/users').send({
    name: 'Get User',
    email: 'get@example.com',
    password: 'password123',
  });

  const cookies = authRes.headers['set-cookie'];
  return cookies;
};

export const setDataBaseBeforeAndAfterTests = () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST as string);
  });
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};
