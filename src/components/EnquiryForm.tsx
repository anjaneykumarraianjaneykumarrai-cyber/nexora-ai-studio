import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ServiceType } from '../types';

export const EnquiryForm: React.FC = () => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    serviceRequired: 'website_development' as ServiceType,
    budgetRange: 'not_sure',
    requirements: '',
    preferredContact: 'whatsapp' as 'whatsapp' | 'email' | 'phone',
    privacyAgreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear errors on change
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!formData.fullName.trim()) {
      setErrorMessage(t.contact.validationErrorName);
      return;
    }

    const emailTrim = formData.email.trim();
    const phoneTrim = formData.phone.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hasValidEmail = emailTrim && emailRegex.test(emailTrim);
    const hasValidPhone = phoneTrim && phoneTrim.replace(/\D/g, '').length >= 7;

    if (!hasValidEmail && !hasValidPhone) {
      setErrorMessage(t.contact.validationErrorContact);
      return;
    }

    if (!formData.requirements.trim()) {
      setErrorMessage(t.contact.validationErrorRequirements);
      return;
    }

    if (!formData.privacyAgreed) {
      setErrorMessage(t.contact.validationErrorPrivacy);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          language,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessId(data.enquiryId);
        // Clear sensitive inputs but keep form in success state
        setFormData({
          fullName: '',
          businessName: '',
          email: '',
          phone: '',
          businessType: '',
          serviceRequired: 'website_development',
          budgetRange: 'not_sure',
          requirements: '',
          preferredContact: 'whatsapp',
          privacyAgreed: false,
        });
      } else {
        setErrorMessage(data.error || 'Unable to submit enquiry. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please verify your connection or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/90 p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-stone-900">{t.contact.successTitle}</h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          {t.contact.successMessage}
        </p>
        <div className="text-xs font-mono text-stone-500 pt-2">
          Tracking ID: <span className="text-stone-800 font-semibold">{successId}</span>
        </div>
        <div className="pt-4">
          <button
            onClick={() => setSuccessId(null)}
            className="px-5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs">
      <div className="space-y-1 mb-6">
        <h3 className="text-xl font-bold text-stone-900">{t.contact.formTitle}</h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {t.contact.formSubtitle}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1">
              <span>{t.contact.fullName}</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t.contact.fullNamePlaceholder}
              required
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            />
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">
              {t.contact.businessName}
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder={t.contact.businessNamePlaceholder}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            />
          </div>
        </div>

        {/* Contact info: Email & Phone (At least one required) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
              <span>{t.contact.emailLabel}</span>
              <span className="text-[11px] text-stone-500 font-normal">Optional if phone provided</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.contact.emailPlaceholder}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center justify-between">
              <span>{t.contact.phoneLabel}</span>
              <span className="text-[11px] text-stone-500 font-normal">Optional if email provided</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t.contact.phonePlaceholder}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            />
          </div>
        </div>

        {/* Business Type & Service Required */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">
              {t.contact.businessType}
            </label>
            <input
              type="text"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              placeholder={t.contact.businessTypePlaceholder}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1">
              <span>{t.contact.serviceRequired}</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              name="serviceRequired"
              value={formData.serviceRequired}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            >
              <option value="website_development">{t.contact.serviceOptions.website_development}</option>
              <option value="ai_voice_agents">{t.contact.serviceOptions.ai_voice_agents}</option>
              <option value="business_automation">{t.contact.serviceOptions.business_automation}</option>
              <option value="multiple_services">{t.contact.serviceOptions.multiple_services}</option>
            </select>
          </div>
        </div>

        {/* Budget & Preferred Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">
              {t.contact.budgetRange}
            </label>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
            >
              <option value="not_sure">{t.contact.budgetOptions.not_sure}</option>
              <option value="tier1">{t.contact.budgetOptions.tier1}</option>
              <option value="tier2">{t.contact.budgetOptions.tier2}</option>
              <option value="tier3">{t.contact.budgetOptions.tier3}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">
              {t.contact.preferredContact}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['whatsapp', 'email', 'phone'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setFormData((prev) => ({ ...prev, preferredContact: method }))}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    formData.preferredContact === method
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {t.contact.contactOptions[method]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-800 flex items-center gap-1">
            <span>{t.contact.requirements}</span>
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="requirements"
            rows={4}
            value={formData.requirements}
            onChange={handleChange}
            placeholder={t.contact.requirementsPlaceholder}
            required
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white resize-y"
          />
        </div>

        {/* Privacy Notice */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            type="checkbox"
            id="privacyAgreed"
            name="privacyAgreed"
            checked={formData.privacyAgreed}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded-sm border-stone-300 text-stone-900 focus:ring-stone-900"
          />
          <label htmlFor="privacyAgreed" className="text-xs text-stone-600 leading-normal cursor-pointer">
            {t.contact.privacyNotice}
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-xs sm:text-sm font-semibold text-stone-900 bg-[#BEF264] hover:bg-[#A3E635] disabled:opacity-50 transition-colors rounded-xl shadow-xs flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.contact.submitting}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t.contact.submitButton}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
