const STATUS_STYLES = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-700',
  Closed: 'bg-gray-200 text-gray-700',
};

const PRIORITY_STYLES = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-700',
};

const TYPE_STYLES = {
  Bug: 'bg-red-50 text-red-700',
  Feature: 'bg-purple-100 text-purple-700',
  Improvement: 'bg-indigo-100 text-indigo-700',
  Task: 'bg-slate-100 text-slate-700',
};

function Badge({ value, styles }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[value] ?? 'bg-gray-100 text-gray-700'
      }`}
    >
      {value}
    </span>
  );
}

export const StatusBadge = ({ value }) => <Badge value={value} styles={STATUS_STYLES} />;
export const PriorityBadge = ({ value }) => <Badge value={value} styles={PRIORITY_STYLES} />;
export const TypeBadge = ({ value }) => <Badge value={value} styles={TYPE_STYLES} />;