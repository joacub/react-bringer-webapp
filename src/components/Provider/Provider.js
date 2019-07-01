import React from 'react';
import PropTypes from 'prop-types';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as AppProvider } from 'contexts/App';
import { Provider as RestAppProvider } from 'contexts/RestApp';
import ThemeContext from 'components/Context/ThemeContext';
import LocaleContext from 'components/Context/LocaleContext';
import { IntlProvider, injectIntl } from 'react-intl';
import { HelmetProvider } from 'react-helmet-async';
import es from 'date-fns/locale/es';
import en from 'date-fns/locale/en-US';

const locales = {
  es,
  en
};

function Fragment(props) {
  return props.children;
}

const Provider = ({
  app, restApp, intl, store, pageContext, children, helmetContext
}) => {
  const ProviderLocale = props => (
    <LocaleContext.Provider value={{ localeContext: { ...props, dateFns: locales[intl.lang] } }}>
      <ThemeContext.Provider value={pageContext}>
        <AppProvider value={app}>
          <RestAppProvider value={restApp}>
            <ReduxProvider store={store}>{children}</ReduxProvider>
          </RestAppProvider>
        </AppProvider>
      </ThemeContext.Provider>
    </LocaleContext.Provider>
  );
  const InjectIntl = injectIntl(ProviderLocale);
  return (
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <IntlProvider textComponent={Fragment} locale={intl.lang} messages={intl.messages}>
          <InjectIntl />
        </IntlProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
};

Provider.defaultProps = {
  helmetContext: {},
  intl: {
    lang: 'en',
    messages: {}
  }
};

Provider.propTypes = {
  pageContext: PropTypes.objectOf(PropTypes.any).isRequired,
  app: PropTypes.objectOf(PropTypes.any).isRequired,
  restApp: PropTypes.objectOf(PropTypes.any).isRequired,
  store: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node.isRequired,
  helmetContext: PropTypes.objectOf(PropTypes.any)
};

export default Provider;
