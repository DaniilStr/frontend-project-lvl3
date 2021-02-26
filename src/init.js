import i18next from 'i18next';
import runApp from './app.js';
import resources from './lokales/index.js';

export default () => {
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
  }).then(() => {
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
    return domElements;
  }).then((domElements) => {
    const {
      mainTitleElement, hintElement, submitButtonElement, inputElement, promoElement,
    } = domElements;
    mainTitleElement.textContent = i18next.t('mainTitle');
    promoElement.textContent = i18next.t('promo');
    inputElement.placeholder = i18next.t('placeholder');
    submitButtonElement.textContent = i18next.t('addButton');
    hintElement.textContent = i18next.t('example');
    return domElements;
  }).then((domElements) => runApp(state, domElements));
};
