import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getApiError } from '../utils/errors';
import FormField from '../components/FormField';
import AuthShell from '../components/AuthShell';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'Enter a valid email';
    if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
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
      await register(form);
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
      title="Create your account"
      subtitle="Start tracking issues with IssueFlow"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
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
          label="Name"
          id="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <button type="submit" disabled={submitting} className="btn-primary w-full py-2.5">
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthShell>
  );

}