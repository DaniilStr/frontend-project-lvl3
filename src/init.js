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

  const i18nextInstance = i18next.createInstance();
  return i18nextInstance.init({
    lng: 'ru',
    resources,
  }, () => {
    const mainTitleElement = document.querySelector('.mainTitle');
    const promoElement = document.querySelector('.promo');
    const inputElement = document.querySelector('.form-control');
    const submitButtonElement = document.querySelector('button[type=submit]');
    const hintElement = document.querySelector('.hint');

    mainTitleElement.textContent = i18nextInstance.t('mainTitle');
    promoElement.textContent = i18nextInstance.t('promo');
    inputElement.placeholder = i18nextInstance.t('placeholder');
    submitButtonElement.textContent = i18nextInstance.t('addButton');
    hintElement.textContent = i18nextInstance.t('example');
    runApp(state, i18nextInstance);
  });
};
