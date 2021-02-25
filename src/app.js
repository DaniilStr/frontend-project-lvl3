import i18next from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import axios from 'axios';
import parse from './parser.js';
import {
  renderValidation, renderError, renderFeeds, renderPosts, renderProcessStateMessage, renderText,
} from './vue.js';

export default () => {
  const proxyUrl = 'https://api.allorigins.win/get?url=';
  const periodUpdatePosts = 10 * 5000;
  const domElements = {
    inputElement: document.querySelector('.form-control'),
    form: document.querySelector('.rss-form'),
    submitButtonElement: document.querySelector('button[type=submit]'),
    feedbackElement: document.querySelector('.feedback'),
    formElement: document.querySelector('.rss-form'),
    feedsContainerElement: document.querySelector('.feeds'),
    postsContainerElement: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    fullArticleBtn: document.querySelector('.full-article'),
    modalHeaderCloseBtn: document.querySelector('.modal-header button'),
    modalFooterCloseBtn: document.querySelector('.modal-footer button'),
    mainTitleElement: document.querySelector('.mainTitle'),
    hintElement: document.querySelector('.hint'),
    promoElement: document.querySelector('.promo'),
  };

  i18next.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          double: 'RSS уже существует',
          url: 'Ссылка должна быть валидным URL',
          404: 'Ресурс не содержит валидный RSS',
          updateError: 'Ошибка обновления данных',
          default: 'Что-то пошло не так...',
          processing: 'добавление RSS...',
          filling: 'RSS успешно загружен',
          mainTitle: 'RSS агрегатор',
          promo: 'Начните читать RSS сегодня! Это легко, это красиво.',
          placeholder: 'ссылка RSS',
          example: 'Пример: https://ru.hexlet.io/lessons.rss',
          addButton: 'Добавить',
          Preview: 'Просмотр',
          Posts: 'Посты',
          Feeds: 'Фиды',
        },
      },
      en: {
        translation: {
          double: 'Rss already exists',
          url: 'Must be valid url',
          404: 'This source doesn\'t contain valid rss',
          updateError: 'Data update failed',
          default: 'Something went wrong...',
          processing: 'adding RSS...',
          filling: 'RSS has been loaded',
          mainTitle: 'RSS Reader',
          promo: 'Start reading RSS today! It is easy, it is nicely.',
          placeholder: 'RSS link',
          example: 'Example: https://ru.hexlet.io/lessons.rss',
          addButton: 'Add',
          Preview: 'Preview',
          Posts: 'Posts',
          Feeds: 'Feeds',
        },
      },
    },
  });

  renderText(domElements);

  const state = {
    networkError: null,
    feeds: [],
    posts: [],
    dataUpdateDate: new Date(),
    form: {
      processState: 'filling',
      fields: {
        rssLink: '',
      },
      valid: true,
      validationError: null,
    },
  };

  const { inputElement, form } = domElements;

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.valid':
        renderValidation(value);
        break;
      case 'form.validationError':
      case 'networkError':
        renderError(value);
        break;
      case 'feeds':
        renderFeeds(value);
        break;
      case 'posts':
        renderPosts(value);
        break;
      case 'form.processState':
        renderProcessStateMessage(value);
        break;
      case 'form.fields.rssLink':
        break;
      default:
        throw new Error(`Unknown statement ${path}`);
    }
  });

  const schema = yup.string().url('url');

  const makeValidate = (link) => {
    const feedUrls = watchedState.feeds.map(
      ({ userInputLink }) => userInputLink,
    );
    let error = null;
    try {
      schema
        .notOneOf(feedUrls, 'double')
        .validateSync(link, { abortEarly: false });
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
