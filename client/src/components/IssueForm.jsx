import { useState } from 'react';
import FormField from './FormField';
import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
} from '../utils/constants';
import { getApiError } from '../utils/errors';

const DEFAULT_VALUES = {
  title: '',
  description: '',
  type: 'Bug',
  priority: 'Medium',
  status: 'Open',
};

// Copy only the editable fields from an issue (never _id or createdBy)
const buildInitialState = (issue) =>
  issue
    ? {
        title: issue.title,
        description: issue.description,
        type: issue.type,
        priority: issue.priority,
        status: issue.status,
      }
    : DEFAULT_VALUES;

const inputClass =
  'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500';

function SelectField({ label, id, options, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className={`${inputClass} bg-white ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function IssueForm({ issue = null, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => buildInitialState(issue));
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errors = {};
    const title = form.title.trim();
    const description = form.description.trim();

    if (!title) errors.title = 'Title is required';
    else if (title.length > 120) errors.title = 'Title cannot exceed 120 characters';

    if (!description) errors.description = 'Description is required';
    else if (description.length > 2000)
      errors.description = 'Description cannot exceed 2000 characters';

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
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
      });
    } catch (error) {
      const { message, fieldErrors: serverErrors } = getApiError(error);
      setFieldErrors(serverErrors);
      setFormError(Object.keys(serverErrors).length > 0 ? '' : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      <FormField
        label="Title"
        id="title"
        value={form.title}
        onChange={handleChange}
        error={fieldErrors.title}
        maxLength={120}
      />

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className={`${inputClass} ${
            fieldErrors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SelectField
          label="Type"
          id="type"
          value={form.type}
          onChange={handleChange}
          options={ISSUE_TYPES}
          error={fieldErrors.type}
        />
        <SelectField
          label="Priority"
          id="priority"
          value={form.priority}
          onChange={handleChange}
          options={ISSUE_PRIORITIES}
          error={fieldErrors.priority}
        />
        <SelectField
          label="Status"
          id="status"
          value={form.status}
          onChange={handleChange}
          options={ISSUE_STATUSES}
          error={fieldErrors.status}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}