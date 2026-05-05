import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { api } from '../api/axios';
vi.mock('../api/axios', () => ({
  api: {
    post: vi.fn(),
  },
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
describe('Login Component', () => {
  it('should render the login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const heading = screen.getByRole('heading', {
      name: /sign in to taskify/i,
    });
    expect(heading).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeInTheDocument();
  });
  it('should show validation errors if the form is submitted empty', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(submitButton);

    const emailError = await screen.findByText(/email is required/i);
    const passwordError = await screen.findByText(/password is required/i);

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });
  it('should call the API and redirect on successful login', async () => {
    const user = userEvent.setup();

    vi.mocked(api.post).mockResolvedValue({
      data: { _id: '123', name: 'Test User', email: 'test@example.com' },
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    await user.type(
      screen.getByLabelText(/email address/i),
      'test@example.com',
    );
    await user.type(screen.getByLabelText(/password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/api/users/auth', {
        email: 'test@example.com',
        password: 'password123',
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
