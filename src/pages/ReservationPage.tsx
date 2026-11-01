import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, MapPin, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { initialSiteSettings } from '../data/initialData.ts';

interface ReservationPageProps {
  navigate: (path: string) => void;
}

export const ReservationPage: React.FC<ReservationPageProps> = ({ navigate }) => {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(tomorrow);
  const [timeSlot, setTimeSlot] = useState('20:30');
  const [bookingSettings, setBookingSettings] = useState(initialSiteSettings);
  const [guests, setGuests] = useState('4');
  const [seatingPreference, setSeatingPreference] = useState('outdoor_riverside');
  const [specialRequest, setSpecialRequest] = useState('');

  const [availableSlots, setAvailableSlots] = useState<{ slot: string; available: boolean; remainingTables: number }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { fetch('/api/v1/site-settings/public').then(r => r.json()).then(result => { if (result.success && result.data) setBookingSettings({ ...initialSiteSettings, ...result.data }); }).catch(() => {}); }, []);

  // Fetch slot availability whenever date changes
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const res = await fetch(`/api/v1/reservations/availability?date=${date}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAvailableSlots(data.data);
          if (!data.data.some((slot: any) => slot.slot === timeSlot && slot.available)) { const firstAvailable = data.data.find((slot: any) => slot.available); if (firstAvailable) setTimeSlot(firstAvailable.slot); }
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !phone.trim() || !date || !timeSlot || !guests) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          date,
          timeSlot,
          guests: parseInt(guests, 10),
          seatingPreference,
          specialRequest: specialRequest.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit reservation request');
      }

      const ref = data.data.reference;
      navigate(`/reservation/confirmation/${ref}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Reservation submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <section className="bg-[#D71920] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#F4C542]">
            Plan Your Dining Stop
          </span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#FFFFFF]">
            Table & Terrace Reservations
          </h1>
          <p className="text-sm sm:text-base text-[#F4F4F4]/85 max-w-2xl mx-auto">
            Book your family table in our air-conditioned dining halls or secure an open-air table on the Indus riverside terrace.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-[#F4F4F4] shadow-sm p-6 sm:p-10 space-y-8">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Date & Time */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-lg text-[#D71920] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F4C542]" />
                <span>1. Select Date & Dining Time</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Preferred Time Slot *
                  </label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]" disabled={isLoadingSlots}>
                    {availableSlots.map((slot) => <option key={slot.slot} value={slot.slot} disabled={!slot.available}>{new Date('2000-01-01T' + slot.slot + ':00').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} {slot.available ? '(' + slot.remainingTables + ' tables left)' : '(Fully booked)'}</option>)}
                  </select>
                </div>
              </div>

              {/* Slot Availability Indicator */}
              <div className="p-3.5 bg-[#FFFFFF] rounded-lg border border-[#F4F4F4] text-xs text-[#6B7280] flex items-center justify-between">
                <span>
                  Real-time status for {date} at {timeSlot}:
                </span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{availableSlots.find((slot) => slot.slot === timeSlot)?.available ? `Available · ${availableSlots.find((slot) => slot.slot === timeSlot)?.remainingTables} tables left` : isLoadingSlots ? "Checking availability…" : "Fully booked"}</span>
                </span>
              </div>
            </div>

            {/* Step 2: Guest Count & Seating Zone */}
            <div className="space-y-4 pt-4 border-t border-[#F4F4F4]">
              <h2 className="font-display font-bold text-lg text-[#D71920] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#F4C542]" />
                <span>2. Party Size & Seating Zone</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Number of Guests *
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  >
                    {Array.from({ length: Number(bookingSettings.reservationMaxGuests) || 40 }, (_, index) => index + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Seating Preference
                  </label>
                  <select
                    value={seatingPreference}
                    onChange={(e) => setSeatingPreference(e.target.value)}
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  >
                    {(Array.isArray(bookingSettings.reservationSeatingOptions) ? bookingSettings.reservationSeatingOptions : ['outdoor_riverside', 'indoor_family_hall', 'executive_lounge', 'any']).map((option: string) => <option key={option} value={option}>{({ indoor_family_hall: 'Air-Conditioned Indoor Family Hall', outdoor_riverside: 'Outdoor Standard Terrace (Indus View)', executive_lounge: 'Executive / Travelers Lounge', any: 'First Available Best Table' } as Record<string, string>)[option] || option.replaceAll('_', ' ')}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Contact Details */}
            <div className="space-y-4 pt-4 border-t border-[#F4F4F4]">
              <h2 className="font-display font-bold text-lg text-[#D71920]">
                3. Primary Guest Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Mobile Phone (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0302 6777908"
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-[#D71920] mb-1">
                    Special Requests or Occasion (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Family birthday, high chair for infant, priority karahi cooking upon arrival..."
                    className="w-full text-sm p-3 rounded-lg border border-[#F4F4F4] bg-white focus:outline-none focus:ring-1 focus:ring-[#F4C542]"
                  />
                </div>
              </div>
            </div>

            {/* Verification Clause */}
            <div className="p-4 bg-[#F4F4F4]/50 rounded-lg text-xs text-[#6B7280] space-y-1">
              <strong className="text-[#D71920] block">Important Reservation Notice:</strong>
              <p>
                Online requests are received by our host desk immediately. Because table capacities are limited during peak hours, our supervisor will telephone or WhatsApp you to reconfirm your party before holding your table.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#D71920] hover:bg-[#171717] text-white font-semibold text-sm rounded shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering Reservation Request...</span>
              ) : (
                <span>Submit Reservation Request</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
