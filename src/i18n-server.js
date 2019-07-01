import i18n from 'i18next';
import Backend from 'i18next-node-fs-backend';
import { reactI18nextModule } from 'react-i18next';
import { LanguageDetector } from 'i18next-express-middleware';

i18n
  .use(Backend)
  .use(reactI18nextModule)
  .use(LanguageDetector)
  .init({
    whitelist: ['en', 'es'],
    fallbackLng: 'en',

    // have a common namespace used around the full app
    ns: ['common', 'common-admin'],
    defaultNS: 'common',

    // debug: !!__DEVELOPMENT__,

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    react: {
      wait: true
    },

    backend: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    }
  });

export default i18n;
