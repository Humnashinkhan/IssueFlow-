function Svg({ className = 'h-5 w-5', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
);

export const LogoutIcon = (props) => (
  <Svg {...props}>
    <path d="M15 12H4m0 0 4-4m-4 4 4 4M10 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8" />
  </Svg>
);

export const InboxIcon = (props) => (
  <Svg {...props}>
    <path d="M4 13h4l1 3h6l1-3h4M4 13l2-8h12l2 8v6H4v-6Z" />
  </Svg>
);

export const StackIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5" />
  </Svg>
);

export const DotIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </Svg>
);

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const CheckIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Svg>
);

export const XCircleIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6m0-6-6 6" />
  </Svg>
);

export const FlagIcon = (props) => (
  <Svg {...props}>
    <path d="M5 21V4m0 0h11l-2 4 2 4H5" />
  </Svg>
);