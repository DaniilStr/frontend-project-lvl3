import i18next from 'i18next';
import runApp from './app.js';
import resources from './lokales/index.js';

export default () => i18next.init({
  lng: 'ru',
  resources,
}, () => {
  const mainTitleElement = document.querySelector('.mainTitle');
  const promoElement = document.querySelector('.promo');
  const inputElement = document.querySelector('.form-control');
  const submitButtonElement = document.querySelector('button[type=submit]');
  const hintElement = document.querySelector('.hint');

  mainTitleElement.textContent = i18next.t('mainTitle');
  promoElement.textContent = i18next.t('promo');
  inputElement.placeholder = i18next.t('placeholder');
  submitButtonElement.textContent = i18next.t('addButton');
  hintElement.textContent = i18next.t('example');
}).then((t) => runApp(t));
