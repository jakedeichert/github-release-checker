import React from 'react';
import pt from 'prop-types';
import { Link as ReactRouterLink } from 'react-router-dom';

const ExternalLink = ({ to, children }) => (
  <a href={to} rel="noopener">
    {children}
  </a>
);

ExternalLink.propTypes = {
  to: pt.string,
};

const Link = ({ to, ext, children }) => {
  if (ext) return <ExternalLink to={ext}>{children}</ExternalLink>;
  return <ReactRouterLink to={to}>{children}</ReactRouterLink>;
};

Link.propTypes = {
  to: pt.string,
  ext: pt.string,
};

export default Link;
