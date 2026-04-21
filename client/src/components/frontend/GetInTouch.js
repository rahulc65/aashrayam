import { useState } from 'react';
import './GetInTouch.css';

const IconPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .94h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconMap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </svg>
);

const IconCheck = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const IconLoader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

const contactItems = [
  {
    icon: <IconPin />,
    label: 'Campus Address',
    value: 'Aashrayam Orchard, Kollengode, Palakkad, Kerala',
  },
  {
    icon: <IconPhone />,
    label: 'Phone',
    value: '+91 80784 78506',
  },
  {
    icon: <IconMail />,
    label: 'Email',
    value: 'admissions@aashrayam.ac.in',
  },
  {
    icon: <IconClock />,
    label: 'Office Hours',
    value: 'Mon – Fri: 9:00 AM – 5:00 PM',
  },
];

const GetInTouch = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', programme: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', programme: '', message: '' });
    }, 1200);
  };

  return (
    <section className="contact section" id="contact">
      <div className="container contact__inner">

        {/* ── Left ── */}
        <div className="contact__left">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Let's Talk About Your Next Step</h2>
          <p className="section-desc">
            Have questions about admissions, programmes, or campus life? Our team
            is here to help you make the right decision for your future.
          </p>

          <div className="contact__info-list">
            {contactItems.map((item, i) => (
              <div className="contact__info-item" key={i}>
                <div className="contact__info-icon">{item.icon}</div>
                <div className="contact__info-text">
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="contact__map">
            <IconMap />
            <span>Interactive map coming soon</span>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="contact__right">
          <div className="contact__form-card">
            <h3 className="contact__form-title">Complete Your Enquiry</h3>
            <p className="contact__form-sub">
              Fill in the form below and we'll get back to you within 24 hours.
            </p>

            {status === 'sent' ? (
              <div className="contact__success">
                <div className="contact__success-icon"><IconCheck /></div>
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. Our admissions team will contact you shortly.</p>
                <button className="btn btn-outline btn-sm" onClick={() => setStatus('')}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="John Doe" required
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" type="email" placeholder="john@email.com" required
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" placeholder="+91 000 000 0000"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Programme of Interest</label>
                    <select className="form-select"
                      value={form.programme} onChange={e => setForm({ ...form, programme: e.target.value })}>
                      <option value="">Select a programme</option>
                      <option>B.Com (Honours) Co-operation</option>
                      <option>B.Sc (Honours) Psychology</option>
                      <option>B.Voc Banking, Finance & Insurance</option>
                      <option>B.Sc (Honours) Artificial Intelligence</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea className="form-textarea"
                    placeholder="Tell us about yourself and your goals..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button
                  type="submit"
                  className="contact__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending'
                    ? <><IconLoader /> Sending...</>
                    : <><IconSend /> Send My Enquiry</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;