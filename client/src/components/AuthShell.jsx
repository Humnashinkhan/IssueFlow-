const FEATURES = [
  'Search, filter and sort your issues',
  'Live dashboard statistics',
  'Only the creator can edit or delete an issue',
];

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg text-base font-bold shadow-sm ${
          light ? 'bg-white/20 text-white' : 'bg-linear-to-br from-indigo-500 to-violet-600 text-white'
        }`}
      >
        I
      </span>
      <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        IssueFlow
      </span>
    </div>
  );
}

export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative">
          <Logo light />
        </div>

        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            Track issues without the noise.
          </h2>
          <p className="mt-4 max-w-md text-indigo-100">
            A small, focused tracker for bugs, features, improvements and tasks.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-indigo-50">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">
                  &#10003;
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-indigo-200">IssueFlow</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-pop">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}