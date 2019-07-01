import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

function loadLocales(url, options, callback) {
  try {
    const locale = require(`./locales/${url}.json`); // eslint-disable-line
    callback(locale, { status: '200' });
  } catch (e) {
    callback(null, { status: '404' });
  }
}

i18n
  .use(Backend)
  .use(reactI18nextModule)
  .init({
    whitelist: ['en', 'es'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common', 'common-admin'],
    defaultNS: 'common',

    interpolation: {
      escapeValue: false // not needed for react!!
    },
    react: {
      wait: true
    },
    backend: {
      loadPath: '{{lng}}/{{ns}}',
      jsonIndent: 2,
      parse: data => data,
      ajax: loadLocales
    }
  });

export default i18n;
