import i18next from 'i18next';
import runApp from './app.js';
import resources from './lokales/index.js';

export default () => {
  const mainTitleElement = document.querySelector('.mainTitle');
  const hintElement = document.querySelector('.hint');
  const submitButtonElement = document.querySelector('button[type=submit]');
  const inputElement = document.querySelector('input');
  const promoElement = document.querySelector('.promo');

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

  const renderText = (t) => {
    mainTitleElement.textContent = t('mainTitle');
    hintElement.textContent = t('example');
    submitButtonElement.textContent = t('addButton');
    inputElement.placeholder = t('placeholder');
    promoElement.textContent = t('promo');
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    return renderText(t);
  }).then(() => runApp(state));
};
