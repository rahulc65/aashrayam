import { useState } from 'react';
import './GetInTouch.css';

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
        <div className="contact__left">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Let's Talk About Your Next Step</h2>
          <p className="section-desc">
            Have questions about admissions, programmes, or campus life? Our team is here to help you make the right decision for your future.
          </p>

          <div className="contact__info-list">
            <div className="contact__info-item">
              <div className="contact__info-icon">📍</div>
              <div>
                <div className="contact__info-label">Campus Address</div>
                <div className="contact__info-val">123 Education Ave, Knowledge City, State 400001</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">📞</div>
              <div>
                <div className="contact__info-label">Phone</div>
                <div className="contact__info-val">+1 (800) 123-4567</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">✉️</div>
              <div>
                <div className="contact__info-label">Email</div>
                <div className="contact__info-val">admissions@orbitedu.com</div>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">🕒</div>
              <div>
                <div className="contact__info-label">Office Hours</div>
                <div className="contact__info-val">Mon – Fri: 9:00 AM – 5:00 PM</div>
              </div>
            </div>
          </div>

          <div className="contact__map">
            <div className="contact__map-placeholder">
              <span>🗺️</span>
              <p>Interactive map coming soon</p>
            </div>
          </div>
        </div>

        <div className="contact__right">
          <div className="contact__form-card">
            <h3 className="contact__form-title">Complete Your Enquiry</h3>
            <p className="contact__form-sub">Fill in the form below and we'll get back to you within 24 hours.</p>

            {status === 'sent' ? (
              <div className="contact__success">
                <div className="contact__success-icon">✅</div>
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. Our admissions team will contact you shortly.</p>
                <button className="btn btn-outline btn-sm" onClick={() => setStatus('')}>Send Another</button>
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
                    <input className="form-input" placeholder="+1 000 000 0000"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Programme of Interest</label>
                    <select className="form-select"
                      value={form.programme} onChange={e => setForm({ ...form, programme: e.target.value })}>
                      <option value="">Select a programme</option>
                      <option>Business & Management</option>
                      <option>Psychology</option>
                      <option>Banking & Finance</option>
                      <option>Artificial Intelligence</option>
                      <option>Hospitality Management</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea className="form-textarea" placeholder="Tell us about yourself and your goals..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  disabled={status === 'sending'}>
                  {status === 'sending' ? '⏳ Sending...' : 'Send My Enquiry →'}
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
