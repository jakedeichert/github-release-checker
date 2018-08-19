import { get } from 'utils/api';

const apiHost = 'https://api.github.com';

const apiOptions = apiToken => {
  return {
    headers: {
      Authorization: `token ${apiToken}`,
    },
  };
};

export const getUser = async (username, apiToken) => {
  const url = `${apiHost}/users/${username}`;
  const { results } = await get(url, apiOptions(apiToken));
  return results;
};

export const getTags = async (username, repo, apiToken) => {
  const url = `${apiHost}/repos/${username}/${repo}/tags?per_page=10`;
  const { results } = await get(url, apiOptions(apiToken));
  return results;
};

export const getReleases = async (username, repo, apiToken) => {
  const url = `${apiHost}/repos/${username}/${repo}/releases?per_page=10`;
  const { results } = await get(url, apiOptions(apiToken));
  return results;
};

export const getStars = async (username, apiToken) => {
  let page = 1;
  const url = pageId =>
    `${apiHost}/users/${username}/starred?page=${pageId}&per_page=100`;
  const { results: allRepos, response } = await get(
    url(page),
    apiOptions(apiToken)
  );
  const linkHeader = response.headers.get('Link') || '';
  const lastLink = linkHeader.match(/page=(\d+)&per_page=100>; rel="last"$/);

  if (!lastLink) return allRepos;

  const lastPage = lastLink.length === 2 ? lastLink[1] : 1;
  const requests = [];
  while (page < lastPage) {
    page++;
    requests.push(get(url(page), apiOptions(apiToken)));
  }
  const allResults = await Promise.all(requests);
  allResults.forEach(({ results }) => {
    allRepos.push(...results);
  });
  return allRepos;
};
