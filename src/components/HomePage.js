import { React, styled } from 'utils/component';
import Header from 'components/Header';
import RepoList from 'components/RepoList';
import IfAuthenticated from 'components/IfAuthenticated';
import SignIn from 'components/SignIn';
import CacheLoader from 'components/CacheLoader';

const Wrapper = styled.div`
  padding: 50px 50px 0;
  margin: 0 auto;
`;

const HomePage = () => (
  <Wrapper>
    <CacheLoader />
    <Header />
    <IfAuthenticated>
      <RepoList />
    </IfAuthenticated>
    <IfAuthenticated not>
      <SignIn />
    </IfAuthenticated>
  </Wrapper>
);

export default HomePage;
