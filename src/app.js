import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import parse from './parser.js';
import makeRendering from './vue.js';

export default (state) => {
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  const periodUpdatePosts = 10 * 5000;
  const inputElement = document.querySelector('.form-control');
  const form = document.querySelector('.rss-form');

  const watchedState = onChange(state, (path, value) => makeRendering(path, value));

  const schema = yup.string();

  const makeValidate = (link) => {
    const feedUrls = watchedState.feeds.map(
      ({ rssLink }) => rssLink,
    );
    let error = null;
    try {
      schema
        .url('url')
        .notOneOf(feedUrls, 'double')
        .validateSync(link, { abortEarly: true });
      error = null;
    } catch (err) {
      error = err;
    }
    watchedState.form.valid = error === null;
    watchedState.form.validationError = error;
  };

  const addFeed = (feed) => {
    const {
      feedName, feedDescription, feedId, feedLink, feedItems,
    } = feed;

    const newFeed = {
      rssLink: watchedState.form.fields.rssLink,
      feedName,
      feedDescription,
      feedId,
      feedLink,
    };
    const newFeeds = [newFeed, ...watchedState.feeds];
    const newPosts = [...feedItems, ...watchedState.posts];
    watchedState.feeds = newFeeds;
    watchedState.posts = newPosts;
  };

  const updatePosts = () => {
    let newPosts = [];
    const { dataUpdateDate } = watchedState;
    const { feeds } = watchedState;
    feeds.forEach(({ rssLink }) => {
      axios.get(`${proxyUrl}${encodeURIComponent(rssLink)}`)
        .then((response) => parse(response.data.contents))
        .then(({ feedItems }) => {
          feedItems.forEach((post) => {
            if (post.postDate > dataUpdateDate) {
              newPosts = [post, ...newPosts];
            }
          });
        })
        .catch((err) => {
          watchedState.networkError = new Error('updateError', err);
          setTimeout(() => updatePosts(), periodUpdatePosts);
        });
    });

    if (newPosts.length > 0) {
      watchedState.posts = [...newPosts, ...watchedState.posts];
      watchedState.dataUpdateDate = new Date();
    }

    setTimeout(() => updatePosts(), periodUpdatePosts);
  };

  inputElement.addEventListener('input', (e) => {
    const userInputLink = e.target.value.trim();
    watchedState.form.fields.rssLink = userInputLink;
    makeValidate(userInputLink);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (
      watchedState.form.processState === 'processing'
      || !watchedState.form.valid
    ) {
      return;
    }
    watchedState.networkError = null;
    watchedState.form.processState = 'processing';
    const { rssLink } = watchedState.form.fields;

    axios
      .get(`${proxyUrl}${encodeURIComponent(rssLink)}`)
      .then((response) => {
        const feed = parse(response.data.contents);
        addFeed(feed);
        watchedState.form.fields.rssLink = '';
        watchedState.form.processState = 'filling';
        updatePosts();
      })
      .catch((err) => {
        watchedState.form.processState = 'failed';
        watchedState.networkError = err.message;
      });
  });
};
