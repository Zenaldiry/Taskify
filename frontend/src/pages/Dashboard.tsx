import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axios';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface CreateTaskInputs {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

const Dashboard = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInputs>({
    defaultValues: { priority: 'medium' },
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/users/logout');
      setAuthUser(null);
      navigate('/login');
      localStorage.clear();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const onSubmitTask = async (data: CreateTaskInputs) => {
    try {
      const response = await api.post('/api/tasks', data);

      setTasks([response.data, ...tasks]);

      reset();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };
  const handleDeleteTask = async (taskId: string) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };
  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'todo' ? 'done' : 'todo';

    try {
      const response = await api.put(`/api/tasks/${taskId}`, {
        status: newStatus,
      });
      setTasks(
        tasks.map((task) => (task._id === taskId ? response.data : task)),
      );
    } catch (error) {
      console.error('Failed to update task', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Welcome back, {authUser?.name}! 👋
          </h1>
          <p className='text-gray-600'>{authUser?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className='px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors'
        >
          Logout
        </button>
      </div>

      <div className='max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='md:col-span-1'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8'>
            <h2 className='text-lg font-bold text-gray-900 mb-4'>
              Create New Task
            </h2>

            <form onSubmit={handleSubmit(onSubmitTask)} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Title
                </label>
                <input
                  type='text'
                  placeholder='What needs to be done?'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder='Add some details...'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none'
                  {...register('description')}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Priority
                </label>
                <select
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white'
                  {...register('priority')}
                >
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                </select>
              </div>

              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-colors'
              >
                {isSubmitting ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>

        <div className='md:col-span-2'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Your Tasks</h2>

          {isLoading ? (
            <p className='text-gray-500'>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center'>
              <p className='text-gray-500'>
                You don't have any tasks yet. Let's create one!
              </p>
            </div>
          ) : (
            <div className='grid gap-4'>
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`bg-white p-5 rounded-xl shadow-sm border flex justify-between items-start transition-all ${task.status === 'done' ? 'border-green-200 bg-green-50/30' : 'border-gray-100'}`}
                >
                  {/* Task Info */}
                  <div>
                    <h3
                      className={`font-semibold text-lg ${task.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p
                        className={`text-sm mt-1 ${task.status === 'done' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {task.description}
                      </p>
                    )}
                    <div className='flex gap-2 mt-3'>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                          task.status === 'done'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : task.priority === 'medium'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {task.priority} priority
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-col gap-2 ml-4'>
                    <button
                      onClick={() => handleUpdateStatus(task._id, task.status)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        task.status === 'done'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {task.status === 'done' ? 'Undo' : 'Complete'}
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className='px-3 py-1.5 text-sm font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
