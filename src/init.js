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
  i18nextInstance.init({
    lng: 'ru',
    resources,
    debug: true,
  }, (err, t) => {
    if (err) console.log('something went wrong loading', err);
    const mainTitleElement = document.querySelector('.mainTitle');
    const promoElement = document.querySelector('.promo');
    const inputElement = document.querySelector('.form-control');
    const submitButtonElement = document.querySelector('button[type=submit]');
    const hintElement = document.querySelector('.hint');

    mainTitleElement.textContent = t('mainTitle');
    promoElement.textContent = t('promo');
    inputElement.placeholder = t('placeholder');
    submitButtonElement.textContent = t('addButton');
    hintElement.textContent = t('example');
  }).then((t) => runApp(state, t));
};
