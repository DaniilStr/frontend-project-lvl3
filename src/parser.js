const getItem = (element) => ({
  postTitle: element.querySelector('title').textContent,
  postDescription: element.querySelector('description').textContent,
  postLink: element.querySelector('link').textContent,
  postDate: element.querySelector('pubDate').textContent,
  postId: element.querySelector('guid').textContent,
});

export default (str) => {
  if (!str) throw new Error('no-parse');
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(str, 'application/xml');
  const channel = xmlDocument.querySelector('channel');
  return {
    feedName: channel.querySelector('title').textContent,
    feedDescription: channel.querySelector('description').textContent,
    feedId: channel.querySelector('guid').textContent,
    feedLink: channel.querySelector('link').textContent,
    feedItems: [...channel.querySelectorAll('item')].map(getItem),
  };
};
