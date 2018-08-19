import { React, styled } from 'utils/component';
import MarkAsRead from 'components/MarkAsRead';
import Refresh from 'components/Refresh';
import SignOut from 'components/SignOut';
import IfAuthenticated from 'components/IfAuthenticated';
import IfReleases from 'components/IfReleases';

const Wrapper = styled.div`
  margin: 0 auto 40px;
`;

const Title = styled.h1`
  color: #8c14d7;
  text-align: center;
  margin: 0 0 20px;
`;

const Buttons = styled.div`
  text-align: center;
  div {
    margin: 0 10px;
  }
`;

const Header = () => (
  <Wrapper>
    <Title>GitHub Release Checker</Title>
    <IfAuthenticated>
      <Buttons>
        <IfReleases>
          <MarkAsRead />
        </IfReleases>
        <Refresh />
        <SignOut />
      </Buttons>
    </IfAuthenticated>
  </Wrapper>
);

export default Header;
