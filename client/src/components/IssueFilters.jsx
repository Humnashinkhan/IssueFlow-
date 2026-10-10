import {
  ISSUE_STATUSES,
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
} from '../utils/constants';
import { SearchIcon } from './Icons';

const controlClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

function FilterSelect({ name, label, value, options, onChange }) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className={controlClass}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export default function IssueFilters({
  searchInput,
  onSearchChange,
  filters,
  onFilterChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-72">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search by title..."
          aria-label="Search by title"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`${controlClass} w-full pl-9`}
        />
      </div>
      <FilterSelect
        name="status"
        label="All statuses"
        value={filters.status}
        options={ISSUE_STATUSES}
        onChange={onFilterChange}
      />
      <FilterSelect
        name="priority"
        label="All priorities"
        value={filters.priority}
        options={ISSUE_PRIORITIES}
        onChange={onFilterChange}
      />
      <FilterSelect
        name="type"
        label="All types"
        value={filters.type}
        options={ISSUE_TYPES}
        onChange={onFilterChange}
      />
      <select
        aria-label="Sort"
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value)}
        className={controlClass}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}