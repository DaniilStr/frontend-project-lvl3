const getItem = (element) => ({
  postTitle: element.querySelector('title').textContent,
  postLink: element.querySelector('link').textContent,
  postDate: element.querySelector('pubDate').textContent,
  postId: element.querySelector('guid').textContent,
});

export default (str) => {
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(str, 'text/xml');
  return {
    feedName: xmlDocument.querySelector('title').textContent,
    feedDescription: xmlDocument.querySelector('description').textContent,
    feedId: xmlDocument.querySelector('guid').textContent,
    feedLink: xmlDocument.querySelector('link').textContent,
    feedItems: [...xmlDocument.querySelectorAll('item')].map(getItem),
  };
};
