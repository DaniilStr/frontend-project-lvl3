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
  }).then(() => runApp(state, i18nextInstance));
};
