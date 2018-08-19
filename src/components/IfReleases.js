import { pt, connect } from 'utils/component';
import { selectors as repoSelectors } from 'store/repos';

export const IfReleases = ({ repos, children }) => {
  if (!repos.length) return null;
  if (typeof children === 'function') return children(repos);
  return children;
};

IfReleases.propTypes = {
  repos: pt.array.isRequired,
};

export default connect(state => ({
  repos: repoSelectors.getAllReposWithUpdates(state),
}))(IfReleases);
