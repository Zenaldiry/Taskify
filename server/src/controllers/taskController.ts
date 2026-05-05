import { Response } from 'express';
import Task from '../models/taskModel';
import { AuthRequest } from '../middleware/authMiddleware';

export const getTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const tasks = await Task.find({ user: req.user?._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Please provide a task title' });
      return;
    }

    const task = await Task.create({
      user: req.user?._id,
      title,
      description,
      priority,
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'Not authorized to update this task' });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });

    res.status(200).json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== req.user?._id.toString()) {
      res.status(401).json({ message: 'Not authorized to delete this task' });
      return;
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
