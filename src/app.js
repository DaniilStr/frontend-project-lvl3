import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parse from './parser.js';
import makeRendering from './vue.js';

export default (state, i18nextInstance) => {
  const proxyUrl = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';
  const periodUpdatePosts = 10 * 1000;
  // const inputElement = document.querySelector('.form-control');
  const form = document.querySelector('.rss-form');

  const watchedState = onChange(state, (path, value) => {
    makeRendering(path, value, i18nextInstance);
  });

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
    let newPosts = [];
    const { dataUpdateDate } = watchedState;
    const { feeds } = watchedState;
    feeds.forEach(({ rssLink }) => {
      axios(`${proxyUrl}${rssLink}`)
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

  /*
  inputElement.addEventListener('input', (e) => {
    const userInputLink = e.target.value.trim();
    watchedState.form.fields.rssLink = userInputLink;
    makeValidate(userInputLink);
  });
  */
  let submitCounter = 0;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitCounter += 1;
    console.log('submitCounter', submitCounter);
    if (
      watchedState.form.processState === 'processing'
    ) {
      return;
    }
    watchedState.networkError = null;
    watchedState.form.processState = 'processing';

    const rssLink = e.target.elements[0].value.trim();
    watchedState.form.fields.rssLink = rssLink;

    const feedUrls = watchedState.feeds.map(({ rssLink: link }) => link);
    console.log('rssLink', rssLink);
    console.log('feedUrls before', feedUrls);

    try {
      console.log('state.feeds before', state.feeds);
      const schema = yup.string().url('url').notOneOf(feedUrls, 'double');
      schema.validateSync(rssLink);
      watchedState.form.valid = true;
      watchedState.form.validationError = null;

      axios(`${proxyUrl}${rssLink}`)
        .then((response) => {
          const feed = parse(response.data.contents);
          addFeed(feed);
          watchedState.form.fields.rssLink = '';
          watchedState.form.processState = 'filling';
          updatePosts();
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
