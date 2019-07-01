import React from 'react';
import withLang from 'hoc/withLang';
import { Link } from 'react-router-dom';

const LinkLang = props => {
  const { lang, to } = props; // eslint-disable-line
  const toLang = `/${lang}${to}`;
  const myProps = Object.assign({}, props, { to: toLang });
  return <Link {...myProps} />;
};

export default withLang(LinkLang);
