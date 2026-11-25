import { useState, useEffect, FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2, Send } from 'lucide-react';
import { Motorcycle, ContactInquiry } from '../types/motorcycle';

interface ContactPageProps {
  motorcycles: Motorcycle[];
  preselectedBikeId?: string;
  onSubmitInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'submittedAt'>) => {
    ok: boolean;
    error?: string;
  };
}

export function ContactPage({
  motorcycles,
  preselectedBikeId,
  onSubmitInquiry,
}: ContactPageProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Karachi');
  const [motorcycleId, setMotorcycleId] = useState(
    preselectedBikeId || motorcycles[0]?.id || ''
  );
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    name: string;
    modelName: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedBikeId) {
      setMotorcycleId(preselectedBikeId);
    } else if (!motorcycleId && motorcycles.length > 0) {
      setMotorcycleId(motorcycles[0].id);
    }
  }, [preselectedBikeId, motorcycles, motorcycleId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (fullName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please provide a valid Pakistan mobile or landline number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 10) {
      setFormError('Please enter a brief message (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);

    const selectedBike = motorcycles.find((b) => b.id === motorcycleId);
    const modelName = selectedBike ? selectedBike.name : 'General Showroom Inquiry';

    setTimeout(() => {
      const result = onSubmitInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        city: city.trim(),
        motorcycleId: selectedBike?.id || 'general',
        motorcycleName: modelName,
        message: message.trim(),
      });

      setIsSubmitting(false);

      if (!result.ok) {
        setFormError(result.error || 'Unable to submit your message right now.');
        return;
      }

      setSubmittedReceipt({
        name: fullName.trim(),
        modelName,
        phone: phone.trim(),
      });
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="pb-8 border-b border-[#1E212A]">
        <p className="text-xs font-semibold tracking-wider text-[#D91B24] uppercase">
          Showroom &amp; Dealership Desk
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Contact HONDA BIKE Pakistan
        </h1>
        <p className="mt-2 text-sm text-[#949BA8] max-w-2xl">
          Request booking availability, city-wise registration estimates, or technical guidance from
          our Pakistan motorcycle showroom team.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Showroom Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-[#131519] border border-[#222630] rounded-lg space-y-5">
            <h2 className="font-display text-xl font-semibold text-white">
              Direct Showroom Contact
            </h2>

            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-[#D91B24] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A909E]">Phone &amp; WhatsApp Desk</p>
                <a
                  href="tel:03710180514"
                  className="text-sm font-medium text-white hover:text-[#D91B24] transition-colors tabular-nums"
                >
                  03710180514
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-[#D91B24] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A909E]">Email Support</p>
                <a
                  href="mailto:ahmedsar3698@gmail.com"
                  className="text-sm font-medium text-white hover:text-[#D91B24] transition-colors"
                >
                  ahmedsar3698@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#D91B24] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A909E]">Showroom City &amp; Address</p>
                <p className="text-sm font-medium text-white">Karachi, Pakistan</p>
                <p className="text-xs text-[#949BA8] leading-relaxed mt-0.5">
                  Shahrah-e-Faisal / Main Motorcycle Market Showroom, Karachi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-[#D91B24] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A909E]">Showroom Hours</p>
                <p className="text-sm text-[#C7CCD6]">Monday – Saturday: 9:30 AM – 7:30 PM PKT</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 bg-[#131519] border border-[#222630] rounded-lg">
            {submittedReceipt ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#152A1E] text-[#34D399] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white">
                  Inquiry Received
                </h2>
                <p className="text-sm text-[#C7CCD6] max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-medium">{submittedReceipt.name}</span>.
                  Your inquiry regarding{' '}
                  <span className="text-white font-medium">{submittedReceipt.modelName}</span> has been
                  recorded. Our showroom team will contact you at{' '}
                  <span className="font-mono text-white tabular-nums">{submittedReceipt.phone}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedReceipt(null)}
                  className="mt-4 inline-flex items-center px-5 py-2.5 text-xs font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] rounded-md transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <h2 className="font-display text-xl font-semibold text-white">
                  Send a Showroom Inquiry
                </h2>

                {formError && (
                  <div
                    role="alert"
                    className="p-3.5 bg-[#2A1418] border border-[#D91B24]/60 rounded-md text-xs sm:text-sm text-[#FCA5A5]"
                  >
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Muhammad Ali"
                      className="w-full h-11 px-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full h-11 px-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 px-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-city" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                      City
                    </label>
                    <select
                      id="contact-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
                    >
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad / Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Other">Other City (Pakistan)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-bike" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                    Motorcycle Model of Interest
                  </label>
                  <select
                    id="contact-bike"
                    value={motorcycleId}
                    onChange={(e) => setMotorcycleId(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white focus:outline-none focus:border-[#D91B24] cursor-pointer"
                  >
                    {motorcycles.map((bike) => (
                      <option key={bike.id} value={bike.id}>
                        {bike.name} ({bike.engineLabel})
                      </option>
                    ))}
                    <option value="general">General Dealership / Parts Inquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#C7CCD6] mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about booking timeline, color availability, or on-road registration charges..."
                    className="w-full p-3.5 bg-[#0E1014] border border-[#262A34] rounded-md text-sm text-white placeholder-[#6E7685] focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#D91B24] hover:bg-[#B8141C] disabled:opacity-60 rounded-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
