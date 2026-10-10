export default function FormField({ label, id, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:ring-2 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
        }`}
        {...inputProps}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}