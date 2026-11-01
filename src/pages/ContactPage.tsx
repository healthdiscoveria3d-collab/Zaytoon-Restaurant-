import React, { useState } from 'react';
import { initialSiteSettings } from '../data/initialData.ts';
import { MapPin, Phone, MessageSquare, Clock, Mail, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Dining Inquiry');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, Message).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          subject,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit message');
      }

      setSuccessMsg('Your message has been delivered to Zaytoon Restaurant management. We will respond promptly.');
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending inquiry. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="bg-[#12372D] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B69A62]">
            Reach Our Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#F7F3EA]">
            Contact & Directions
          </h1>
          <p className="text-sm sm:text-base text-[#EDE5D7]/85 max-w-2xl mx-auto">
            Situated directly along the Indus riverbank near Ghazi Ghat Toll Plaza on the N-70 Highway.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EDE5D7] shadow-sm space-y-6">
              <h2 className="font-display font-bold text-xl text-[#12372D]">
                Restaurant Coordinates
              </h2>

              <div className="space-y-4 text-sm text-[#242824]/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#12372D]">Physical Location:</strong>
                    <span>{initialSiteSettings.address}</span>
                    <span className="block text-xs text-[#777B75] mt-0.5">
                      (N-70 National Highway Dining Milestone)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#12372D]">Operating Hours:</strong>
                    <span>{initialSiteSettings.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#12372D]">Direct Phone Line:</strong>
                    <a
                      href="tel:+923026777908"
                      className="text-[#12372D] font-bold hover:underline"
                    >
                      {initialSiteSettings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#12372D]">WhatsApp Inquiries:</strong>
                    <a
                      href="https://wa.me/923026777908"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#12372D]">Official Email:</strong>
                    <span>{initialSiteSettings.email}</span>
                  </div>
                </div>
              </div>

              {/* Direct Maps Action */}
              <div className="pt-4 border-t border-[#EDE5D7]">
                <a
                  href="https://maps.google.com/?q=Ghazi+Ghat+Toll+Plaza+Dera+Ghazi+Khan"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#12372D] hover:bg-[#0B241E] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-[#B69A62]" />
                  <span>Navigate with Google Maps</span>
                </a>
              </div>
            </div>

            {/* Owner Pre-Launch verification banner */}
            <div className="p-4 rounded-xl bg-[#EDE5D7]/60 border border-[#EDE5D7] text-xs text-[#777B75] space-y-1">
              <strong className="text-[#12372D] block">Pre-Launch Calibration:</strong>
              <p>
                Phone numbers and location coordinates are stored in dynamic system settings for seamless updates via the future Admin application.
              </p>
            </div>
          </div>

          {/* Right: Working Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xl border border-[#EDE5D7] shadow-sm space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-[#12372D]">
                Send an Inquiry or Feedback
              </h2>
              <p className="text-xs text-[#777B75] mt-1">
                Whether organizing a highway bus convoy stop, asking about catering, or sharing a dining experience.
              </p>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sharjeel Khan"
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0302 6777908"
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.pk"
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                  >
                    <option value="General Dining Inquiry">General Dining Inquiry</option>
                    <option value="Large Highway Group / Convoy">Large Highway Group / Convoy Booking</option>
                    <option value="Catering & Events">Family Gathering / Catering</option>
                    <option value="Food Quality & Feedback">Guest Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[#12372D] mb-1">
                  Your Message or Special Request *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our hospitality team assist you?"
                  className="w-full text-sm p-3 rounded-lg border border-[#EDE5D7] bg-[#F7F3EA]/30 focus:outline-none focus:ring-1 focus:ring-[#B69A62]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#12372D] hover:bg-[#0B241E] text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
