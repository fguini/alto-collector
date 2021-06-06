import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    '../locales',
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i,
  );
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

const DEFAULT_LANGUAGE = 'en';
const messages = loadLocaleMessages();

let systemLocale = navigator.language.split('-');
if (!messages[systemLocale]) systemLocale = DEFAULT_LANGUAGE;

let savedLocale = localStorage.getItem('language');
if (!messages[savedLocale]) savedLocale = DEFAULT_LANGUAGE;

export default new VueI18n({
  locale: savedLocale || systemLocale || DEFAULT_LANGUAGE,
  fallbackLocale: systemLocale || DEFAULT_LANGUAGE,
  messages,
});
