/*
import i18next from 'i18next';
import runApp from './app.js';

export default () => {
  i18next.init({
    lng: 'en',
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

  runApp(state);
};
*/
