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
    resources,
  }).then((t) => runApp(state, t));
};
