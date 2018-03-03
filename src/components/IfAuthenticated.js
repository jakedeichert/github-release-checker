import pt from 'prop-types';
import { connect } from 'react-redux';
import { selectors as userSelectors } from 'store/user';

export const IfAuthenticated = ({ hasToken, not, children }) => {
  if (hasToken === !not) return children;
  return null;
};

IfAuthenticated.propTypes = {
  hasToken: pt.bool,
  not: pt.bool,
};

IfAuthenticated.defaultProps = {
  hasToken: false,
  not: false,
};

export default connect(
  state => ({
    hasToken: userSelectors.hasToken(state),
  }),
  null
)(IfAuthenticated);
