import { pt, connect } from 'utils/component';
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
