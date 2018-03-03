import React, { Fragment } from 'react';
import styled from 'styled-components';
import formatDate from 'date-fns/format';
import Link from 'components/Link';
import IfReleases from 'components/IfReleases';

const getRepoUrl = (owner, repo) => `https://github.com/${owner}/${repo}`;

const Wrapper = styled.div`
  color: black;
  margin: 0 auto;
  max-width: 700px;
`;

const RepoItem = styled.li`
  list-style: none;
  margin: 0 auto 20px;
`;

const RepoName = styled.h3`
  background: #c377f2;
  padding: 10px;
  a {
    color: white;
    text-decoration: none;
    &:hover {
      color: #57ff47;
    }
  }
`;

const RepoBody = styled.ul`
  border: 1px solid #c377f2;
  padding: 10px;
  a {
    color: #c377f2;
    text-decoration: none;
    &:hover {
      color: #8c14d7;
    }
  }
`;

const List = styled.ul`
  li {
    list-style: none;
  }
`;

export default class RepoList extends React.Component {
  render() {
    return (
      <Wrapper>
        <IfReleases>{repos => this.renderList(repos)}</IfReleases>
      </Wrapper>
    );
  }

  renderList(repos) {
    return (
      <ul>
        {repos.map(v => (
          <RepoItem key={v.id}>
            {this.renderName(v)}
            <RepoBody>
              {v.releases.length ? this.renderReleases(v) : this.renderTags(v)}
            </RepoBody>
          </RepoItem>
        ))}
      </ul>
    );
  }

  renderName(repo) {
    const { ownerUsername, name } = repo;
    return (
      <RepoName>
        <Link ext={getRepoUrl(ownerUsername, name)}>
          {ownerUsername}/
          {name}
        </Link>
      </RepoName>
    );
  }

  renderReleases(repo) {
    const { releases } = repo;
    const d = i => `- ${formatDate(i.publishedAt, 'ddd, MMM DD, YYYY')}`;
    return (
      <Fragment>
        <h4>Releases</h4>
        <List>
          {releases.map(i => (
            <li key={i.id}>
              <Link ext={i.htmlUrl}>{i.name || i.tagName}</Link> {d(i)}
            </li>
          ))}
        </List>
      </Fragment>
    );
  }

  renderTags(repo) {
    const { tags } = repo;
    return (
      <Fragment>
        <h4>Tags</h4>
        <List>{tags.map(i => <li key={i.commit.sha}>{i.name}</li>)}</List>
      </Fragment>
    );
  }
}
