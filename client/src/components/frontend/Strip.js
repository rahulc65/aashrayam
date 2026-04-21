import './Strip.css';

const items = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
    ),
    title: 'Focus-first environment',
    sub: 'A calm campus built for deep focus.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      </svg>
    ),
    title: 'Significantly lower fees',
    sub: ' High-value education at a fraction of the cost',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    title: 'Rare programs in Palakkad',
    sub: 'Uncommon courses with a clear edge.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Small batches, big impact',
    sub: 'Personal attention that drives real progress',
  },
];

const Strip = () => (
  <div className="strip">
    <div className="strip__track">
      {[...items, ...items].map((item, i) => (
        <div className="strip__item" key={i}>
          <div className="strip__icon">{item.icon}</div>
          <div className="strip__content">
            <strong className="strip__title">{item.title}</strong>
            <span className="strip__sub">{item.sub}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Strip;
