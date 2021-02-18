import i18next from 'i18next';
import runApp from './app.js';
import resources from './lokales/index.js';
import { renderText } from './vue.js';

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
    lng: 'en',
    debug: true,
    resources,
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    return renderText(t);
  }).then(() => runApp(state));
};
