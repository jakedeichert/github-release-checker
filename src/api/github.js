import { createApi } from 'utils/api';

const api = createApi('https://api.github.com');

export const setAuthToken = authToken => {
  if (!authToken) return api.setAuth(null);
  api.setAuth(`token ${authToken}`);
};

export const getUser = async username => {
  const { results } = await api.get(`/users/${username}`);
  return results;
};

export const getTags = async (username, repo) => {
  const url = `/repos/${username}/${repo}/tags?per_page=10`;
  const { results } = await api.get(url);
  return results;
};

export const getReleases = async (username, repo) => {
  const url = `/repos/${username}/${repo}/releases?per_page=10`;
  const { results } = await api.get(url);
  return results;
};

export const getStars = async username => {
  let page = 1;
  const url = pageId =>
    `/users/${username}/starred?page=${pageId}&per_page=100`;
  const { results: allRepos, response } = await api.get(url(page));
  const linkHeader = response.headers.get('Link') || '';
  const lastLink = linkHeader.match(/page=(\d+)&per_page=100>; rel="last"$/);

  if (!lastLink) return allRepos;

  const lastPage = lastLink.length === 2 ? lastLink[1] : 1;
  const requests = [];
  while (page < lastPage) {
    page++;
    requests.push(api.get(url(page)));
  }
  const allResults = await Promise.all(requests);
  allResults.forEach(({ results }) => {
    allRepos.push(...results);
  });
  return allRepos;
};
