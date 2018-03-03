import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'components/Button';
import { actions as repoActions } from 'store/repos';

export class MarkAsRead extends React.Component {
  static propTypes = {
    markAllAsRead: pt.func,
  };

  render() {
    return <Button onClick={this.handleMarkAllAsRead}>mark all as read</Button>;
  }

  handleMarkAllAsRead = () => {
    this.props.markAllAsRead();
  };
}

export default connect(null, dispatch => ({
  markAllAsRead: () => dispatch(repoActions.markAllAsRead()),
}))(MarkAsRead);
