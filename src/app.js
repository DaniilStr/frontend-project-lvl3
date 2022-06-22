import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parse from './parser.js';
import makeRendering from './view.js';

export default (state, i18nextInstance) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get?disableCache=true&url=';
  const periodUpdatePosts = 10 * 1000;

  // ----- for instant validation -----
  // const inputElement = document.querySelector('.form-control');

  const form = document.querySelector('.rss-form');

  const watchedState = onChange(state, (path, value) => {
    makeRendering(path, value, i18nextInstance);
  });

  // ----- for instant validation ------
  /*
  const makeValidate = (link) => {
    const feedUrls = watchedState.feeds.map(
      ({ rssLink }) => rssLink,
    );
    const schema = yup.string().url('url').notOneOf(feedUrls, 'double');
    let error = null;
    try {
      schema.validateSync(link);
      error = null;
    } catch (err) {
      error = err;
    }
    watchedState.form.valid = error === null;
    watchedState.form.validationError = error;
  };
  */

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
    const newPosts = [];
    const { dataUpdateDate } = watchedState;
    const { feeds } = watchedState;
    feeds.forEach(({ rssLink }) => {
      axios(`${proxyUrl}${rssLink}`)
        .then((response) => parse(response.data.contents))
        .then(({ feedItems }) => {
          feedItems.forEach((post) => {
            if (post.postDate > dataUpdateDate) {
              newPosts.unshift(post);
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

  // ----- for instant validation -----
  /*
  inputElement.addEventListener('input', (e) => {
    const userInputLink = e.target.value.trim();
    watchedState.form.fields.rssLink = userInputLink;
    makeValidate(userInputLink);
  });
  */

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (
      watchedState.form.processState === 'processing'
    ) {
      return;
    }
    watchedState.form.processState = 'processing';
    watchedState.networkError = null;

    const rssLink = e.target.elements[0].value.trim();
    watchedState.form.fields.rssLink = rssLink;

    const feedUrls = watchedState.feeds.map(({ rssLink: link }) => link);

    try {
      const schema = yup.string().url('url').notOneOf(feedUrls, 'double');
      schema.validateSync(rssLink);
      watchedState.form.valid = true;
      watchedState.form.validationError = null;

      axios(`${proxyUrl}${rssLink}`)
        .then((response) => {
          const feed = parse(response.data.contents);
          addFeed(feed);
          watchedState.form.fields.rssLink = '';
          setTimeout(() => updatePosts(), periodUpdatePosts);
          watchedState.form.processState = 'filling';
        })
        .catch((err) => {
          watchedState.networkError = err;
          watchedState.form.processState = 'failed';
        });
    } catch (err) {
      watchedState.form.valid = false;
      watchedState.form.validationError = err;
      watchedState.form.processState = 'failed';
    }
  });
};
