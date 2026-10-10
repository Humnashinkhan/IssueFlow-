import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getApiError } from '../utils/errors';
import FormField from '../components/FormField';
import AuthShell from '../components/AuthShell';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Login() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go straight to the dashboard
  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Enter a valid email';
    if (!form.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login(form);
    } catch (error) {
      const { message, fieldErrors: serverErrors } = getApiError(error);
      setFieldErrors(serverErrors);
      setFormError(Object.keys(serverErrors).length > 0 ? '' : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to IssueFlow"
      footer={
        <>
          No account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Register
          </Link>
        </>
      }
    >
      {formError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
        />
        <FormField
          label="Password"
          id="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          autoComplete="current-password"
        />
        <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthShell>
  );

}