import React from 'react';
import pt from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'components/Button';
import { actions as userActions } from 'store/user';

export class SignOut extends React.Component {
  static propTypes = {
    signOut: pt.func,
  };

  render() {
    return <Button onClick={this.handleSignOut}>sign out</Button>;
  }

  handleSignOut = () => {
    this.props.signOut();
  };
}

export default connect(null, dispatch => ({
  signOut: () => dispatch(userActions.signOut()),
}))(SignOut);
