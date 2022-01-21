const getItem = (element) => ({
  postTitle: element.querySelector('title')?.textContent,
  postDescription: element.querySelector('description')?.textContent,
  postLink: element.querySelector('link')?.textContent,
  postDate: element.querySelector('pubDate')?.textContent,
  postId: element.querySelector('guid')?.textContent,
});

export default (str) => {
  const domParser = new DOMParser();
  const xmlDocument = domParser.parseFromString(str, 'application/xml');
  if (xmlDocument.querySelector('parsererror')) throw new Error('no-parse');
  return {
    feedName: xmlDocument.querySelector('title')?.textContent,
    feedDescription: xmlDocument.querySelector('description')?.textContent,
    feedId: xmlDocument.querySelector('guid')?.textContent,
    feedLink: xmlDocument.querySelector('link')?.textContent,
    feedItems: [...xmlDocument.querySelectorAll('item')].map(getItem),
  };
};
