import { useState, useEffect, useCallback } from 'react';

const CONSENT_KEY = 'pepacks_cookie_consent';
const CONSENT_ID_KEY = 'pepacks_cookie_consent_id';

const API_BASE = window.location.origin;

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}/api${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'same-origin',
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  return response.json();
}

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch {
        setShowBanner(true);
      }
    } else {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = useCallback(async (preferences) => {
    const consentData = {
      necessary: true,
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      preferences: preferences.preferences || false,
    };

    try {
      const response = await apiFetch('/cookies', {
        method: 'POST',
        body: consentData,
      });

      if (response.success) {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
        localStorage.setItem(CONSENT_ID_KEY, response.consent_id);
        setConsent(consentData);
        setShowBanner(false);
        setShowPreferences(false);
      }
    } catch (err) {
      console.error('Error saving consent:', err);
    }
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({ necessary: true, analytics: true, marketing: true, preferences: true });
  }, [saveConsent]);

  const rejectAll = useCallback(() => {
    saveConsent({ necessary: true, analytics: false, marketing: false, preferences: false });
  }, [saveConsent]);

  const updateConsent = useCallback((preferences) => {
    saveConsent(preferences);
  }, [saveConsent]);

  const hasConsented = (type) => {
    if (!consent) return false;
    return consent[type] === true;
  };

  return {
    consent,
    showBanner,
    showPreferences,
    setShowBanner,
    setShowPreferences,
    acceptAll,
    rejectAll,
    saveConsent,
    updateConsent,
    hasConsented,
  };
}

export function CookieBanner() {
  const {
    showBanner,
    acceptAll,
    rejectAll,
    setShowPreferences,
  } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm text-white p-4 z-50 border-t border-purple-500/30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm md:text-base">
          <p>
            We use cookies to improve your experience. Necessary cookies are essential for the website to function.
            You can accept all or manage your preferences.{' '}
            <a href="/cookies" className="text-purple-400 hover:text-purple-300 underline">
              Cookie Policy
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={rejectAll}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Reject All
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-sm transition-colors"
          >
            Preferences
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-sm transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesModal() {
  const { showPreferences, setShowPreferences, saveConsent } = useCookieConsent();
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  if (!showPreferences) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-purple-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Cookie Preferences</h3>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={true}
              disabled
              className="mt-1 accent-purple-500"
            />
            <div>
              <span className="text-white font-medium">Necessary</span>
              <p className="text-gray-400 text-sm">Essential for the website to function. Cannot be disabled.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.analytics}
              onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
              className="mt-1 accent-purple-500"
            />
            <div>
              <span className="text-white font-medium">Analytics</span>
              <p className="text-gray-400 text-sm">Help us understand how you use the site to improve it.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.marketing}
              onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
              className="mt-1 accent-purple-500"
            />
            <div>
              <span className="text-white font-medium">Marketing</span>
              <p className="text-gray-400 text-sm">To show you personalized and relevant content.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.preferences}
              onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
              className="mt-1 accent-purple-500"
            />
            <div>
              <span className="text-white font-medium">Preferences</span>
              <p className="text-gray-400 text-sm">Remember your settings and preferences for future visits.</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowPreferences(false)}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => saveConsent(prefs)}
            className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-400 rounded-lg text-white transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
