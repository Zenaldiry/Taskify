import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/axios';

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login = () => {
  const [apiError, setApiError] = useState('');
  const { setAuthUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError('');
    try {
      const response = await api.post('/api/users/auth', data);
      setAuthUser(response.data);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setApiError(
          err.response?.data?.message || 'An error occurred during login',
        );
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white p-8 shadow-lg rounded-xl'>
        <div className='mb-8'>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            Sign in to Taskify
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Link
              to='/register'
              className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
            >
              create a new account
            </Link>
          </p>
        </div>

        {apiError && (
          <div className='bg-red-50 border-l-4 border-red-500 p-4 rounded-md'>
            <p className='text-sm text-red-700 font-medium'>{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label
              className='block text-sm font-medium text-gray-700 mb-1'
              htmlFor='email'
            >
              Email address
            </label>
            <input
              className='w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              id='email'
              type='email'
              placeholder='Email address'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              className='block text-sm font-medium text-gray-700 mb-1'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              id='password'
              type='password'
              placeholder='Password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors'
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
