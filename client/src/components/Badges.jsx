const STATUS_STYLES = {
  Open: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  'In Progress': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Resolved: 'bg-green-50 text-green-700 ring-green-600/20',
  Closed: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};

const STATUS_DOTS = {
  Open: 'bg-blue-500',
  'In Progress': 'bg-amber-500',
  Resolved: 'bg-green-500',
  Closed: 'bg-slate-400',
};

const PRIORITY_STYLES = {
  Low: 'bg-green-50 text-green-700 ring-green-600/20',
  Medium: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  High: 'bg-red-50 text-red-700 ring-red-600/20',
};

const TYPE_STYLES = {
  Bug: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  Feature: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  Improvement: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  Task: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

function Badge({ value, styles, dots }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        styles[value] ?? 'bg-slate-100 text-slate-700 ring-slate-500/20'
      }`}
    >
      {dots && <span className={`h-1.5 w-1.5 rounded-full ${dots[value] ?? 'bg-slate-400'}`} />}
      {value}
    </span>
  );
}

export const StatusBadge = ({ value }) => (
  <Badge value={value} styles={STATUS_STYLES} dots={STATUS_DOTS} />
);
export const PriorityBadge = ({ value }) => <Badge value={value} styles={PRIORITY_STYLES} />;
export const TypeBadge = ({ value }) => <Badge value={value} styles={TYPE_STYLES} />;