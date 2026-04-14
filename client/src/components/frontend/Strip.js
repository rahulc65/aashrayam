import './Strip.css';

const items = [
  { icon: '🎓', text: 'Nationally Accredited Institution' },
  { icon: '🌍', text: 'International Student Exchange' },
  { icon: '💼', text: '96% Graduate Employment' },
  { icon: '🏆', text: 'Top Ranked 2025' },
  { icon: '📚', text: '50+ Programmes Offered' },
  { icon: '🤝', text: '200+ Industry Partners' },
];

const Strip = () => (
  <div className="strip">
    <div className="strip__track">
      {[...items, ...items].map((item, i) => (
        <div className="strip__item" key={i}>
          <span className="strip__icon">{item.icon}</span>
          <span className="strip__text">{item.text}</span>
          <span className="strip__sep">◆</span>
        </div>
      ))}
    </div>
  </div>
);

export default Strip;
