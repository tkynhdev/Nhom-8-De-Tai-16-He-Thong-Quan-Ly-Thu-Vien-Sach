import React from 'react';

export type IconName =
  | 'alert'
  | 'archive'
  | 'arrowUp'
  | 'book'
  | 'calendar'
  | 'chart'
  | 'check'
  | 'clock'
  | 'edit'
  | 'home'
  | 'id'
  | 'info'
  | 'mail'
  | 'phone'
  | 'print'
  | 'refresh'
  | 'search'
  | 'settings'
  | 'shield'
  | 'user'
  | 'users';

const paths: Record<IconName, React.ReactNode> = {
  alert: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20h15.6a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z" />,
  archive: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7v12h14V7M8 11h8" />,
  arrowUp: <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 7-7 7 7M12 5v14" />,
  book: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.3v13m0-13C10.8 5.5 9.2 5 7.5 5S4.2 5.5 3 6.3v13C4.2 18.5 5.8 18 7.5 18s3.3.5 4.5 1.3m0-13C13.2 5.5 14.8 5 16.5 5s3.3.5 4.5 1.3v13C19.8 18.5 18.2 18 16.5 18s-3.3.5-4.5 1.3" />,
  calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3m8-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-3" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />,
  clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  edit: <path strokeLinecap="round" strokeLinejoin="round" d="m4 16-.8 4 4-.8L18.5 7.9a2.1 2.1 0 0 0-3-3L4 16Z" />,
  home: <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10h-6v-6H9v6H3V10Z" />,
  id: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4V6Zm3 4h4m-4 3h6m3-3h1m-1 3h1" />,
  info: <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  mail: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />,
  phone: <path strokeLinecap="round" strokeLinejoin="round" d="M6.6 4h3l1.5 4-2 1.2a11 11 0 0 0 5.7 5.7l1.2-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.6 6.2 2 2 0 0 1 6.6 4Z" />,
  print: <path strokeLinecap="round" strokeLinejoin="round" d="M7 8V4h10v4M7 17H5a2 2 0 0 1-2-2v-4h18v4a2 2 0 0 1-2 2h-2M7 14h10v6H7v-6Z" />,
  refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M20 6v5h-5M4 18v-5h5m10-2a7 7 0 0 0-12-4M5 13a7 7 0 0 0 12 4" />,
  search: <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />,
  settings: <path strokeLinecap="round" strokeLinejoin="round" d="M10.3 4.3c.4-1.7 2.9-1.7 3.4 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.3.8 2.4 2.4a1.7 1.7 0 0 0 1 2.6c1.8.4 1.8 2.9 0 3.3a1.7 1.7 0 0 0-1 2.6c.9 1.5-.9 3.3-2.4 2.4a1.7 1.7 0 0 0-2.6 1c-.5 1.8-3 1.8-3.4 0a1.7 1.7 0 0 0-2.6-1c-1.5.9-3.3-.9-2.4-2.4a1.7 1.7 0 0 0-1-2.6c-1.8-.4-1.8-2.9 0-3.3a1.7 1.7 0 0 0 1-2.6c-.9-1.6.9-3.3 2.4-2.4a1.7 1.7 0 0 0 2.6-1ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.5 3 7.5 7 10 4-2.5 7-5.5 7-10V6l-7-3Z" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a6 6 0 0 0-12 0m12 0a6 6 0 0 1 6-6m-6 6h6M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm9 1a3 3 0 1 0 0-6" />,
};

const Icon = ({ name, className = 'h-4 w-4' }: { name: IconName; className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    {paths[name]}
  </svg>
);

export default Icon;
