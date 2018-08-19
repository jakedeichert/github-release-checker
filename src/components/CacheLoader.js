import { React, pt, connect } from 'utils/component';
import { actions as userActions } from 'store/user';
import { actions as repoActions } from 'store/repos';

export class CacheLoader extends React.Component {
  static propTypes = {
    loadCachedUser: pt.func,
    loadCachedRepos: pt.func,
  };

  componentDidMount() {
    const { loadCachedUser, loadCachedRepos } = this.props;
    loadCachedUser();
    loadCachedRepos();
  }

  render() {
    return null;
  }
}

export default connect(
  null,
  dispatch => ({
    loadCachedUser: () => dispatch(userActions.loadCache()),
    loadCachedRepos: () => dispatch(repoActions.loadCache()),
  })
)(CacheLoader);
