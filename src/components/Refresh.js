import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { actions as repoActions } from 'store/repos';
import { Button } from 'components/Button';

export class Refresh extends React.Component {
  static propTypes = {
    getStars: pt.func,
    getReleases: pt.func,
    getTags: pt.func,
    updateCache: pt.func,
  };

  render() {
    return <Button onClick={this.refresh}>check for new releases</Button>;
  }

  refresh = () => {
    const { getStars, getReleases, getTags, updateCache } = this.props;
    getStars()
      .then(() => {
        return getReleases();
      })
      .then(() => {
        return getTags();
      })
      .then(() => {
        return updateCache();
      });
  };
}

export default connect(null, dispatch => ({
  getStars: () => dispatch(repoActions.getStars()),
  getReleases: () => dispatch(repoActions.getReleases()),
  getTags: () => dispatch(repoActions.getTags()),
  updateCache: () => dispatch(repoActions.updateCache()),
}))(Refresh);
