import { React, pt, styled, connect } from 'utils/component';
import { actions as userActions } from 'store/user';
import Link from 'components/Link';
import { Button } from 'components/Button';
import Input from 'components/Input';

const Wrapper = styled.div`
  margin: 60px auto 0;
  text-align: center;
`;

const InstructionsWrapper = styled.div`
  margin: 10px auto 30px;
  color: grey;
  font-size: 14px;
  a {
    color: #c377f2;
    text-decoration: none;
    &:hover {
      color: #8c14d7;
    }
  }
`;

const Inputs = styled.div`
  margin: 0 auto 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Instructions = () => (
  <InstructionsWrapper>
    <p>
      {' '}
      Create a{' '}
      <Link ext="https://github.com/settings/tokens">
        personal access token
      </Link>{' '}
      on GitHub.
    </p>
    <p>Only public permission is needed to read your stars list.</p>
  </InstructionsWrapper>
);

export class SignIn extends React.Component {
  static propTypes = {
    signIn: pt.func,
  };

  state = {
    username: '',
    token: '',
  };

  render() {
    return (
      <Wrapper>
        <p>You need to set your API token first.</p>
        <Instructions />
        <Inputs>
          <Input label="Username" onChange={this.handleChangeUsername} />
          <Input label="Access Token" onChange={this.handleChangeToken} />
        </Inputs>
        <Button onClick={this.handleClickSave}>Save</Button>
      </Wrapper>
    );
  }

  handleChangeUsername = username => {
    this.setState({
      username,
    });
  };

  handleChangeToken = token => {
    this.setState({
      token,
    });
  };

  handleClickSave = () => {
    const { signIn } = this.props;
    const { username, token } = this.state;
    signIn(username, token);
  };
}

export default connect(
  null,
  dispatch => ({
    signIn: (username, apiToken) =>
      dispatch(userActions.signIn(username, apiToken)),
  })
)(SignIn);
