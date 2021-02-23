import i18next from 'i18next';
import runApp from './app.js';
import resources from './lokales/index.js';
import { renderText } from './vue.js';

export default () => {
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

  i18next.init({
    lng: 'ru',
    debug: true,
    resources,
  }, (err) => {
    console.log('error', err);
    renderText(domElements);
  }).then(() => runApp(state, domElements));
};
