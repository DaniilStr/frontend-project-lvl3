import i18next from 'i18next';

const fieldElement = document.querySelector('input');
const submitButtonElement = document.querySelector('button');
const hintElement = document.querySelector('.hint');
const mainTitleElement = document.querySelector('.mainTitle');
const promoElement = document.querySelector('.promo');

const renderText = (t) => {
  mainTitleElement.textContent = t('mainTitle');
  hintElement.textContent = t('example');
  submitButtonElement.textContent = t('addButton');
  fieldElement.placeholder = t('placeholder');
  promoElement.textContent = t('promo');
};

const makeRendering = (path, value) => {
  const inputElement = document.querySelector('input');
  const feedbackElement = document.querySelector('.feedback');
  const buttonElement = document.querySelector('button');
  const formElement = document.querySelector('.rss-form');
  const feedsContainerElement = document.querySelector('.feeds');
  const postsContainerElement = document.querySelector('.posts');

  const renderValidation = (valid) => {
    if (!valid) {
      inputElement.classList.add('is-invalid');
      buttonElement.classList.add('disabled');
      return;
    }
    inputElement.classList.remove('is-invalid');
    buttonElement.classList.remove('disabled');
  };

  const renderError = (err) => {
    inputElement.classList.remove('is-invalid');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.innerHTML = '';

    if (err === null) {
      return;
    }
    const { message } = err;

    inputElement.classList.add('is-invalid');
    feedbackElement.innerHTML = i18next.t([message, 'default']);
    feedbackElement.classList.add('text-danger');
  };

  const renderProcessStateMessage = (alert) => {
    feedbackElement.classList.remove('text', 'text-danger', 'text-success');
    feedbackElement.textContent = '';
    if (alert === 'processing') {
      buttonElement.classList.add('disabled');
      feedbackElement.classList.add('text');
      feedbackElement.textContent = i18next.t(alert);
    }
    if (alert === 'filling') {
      buttonElement.classList.remove('disabled');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18next.t(alert);
    }
  };

  const renderFeeds = (feeds) => {
    if (feeds.length === 0) {
      feedsContainerElement.innerHTML = '';
      return;
    }

    const feed = feeds[0];
    const { feedName, feedDescription, feedId } = feed;

    let ul = feedsContainerElement.querySelector('ul');
    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = 'Feeds';
      ul = document.createElement('ul');
      ul.classList.add('list-group', 'mb-5');
      feedsContainerElement.append(h2, ul);
    }

    const h3 = document.createElement('h3');
    h3.classList.add('mb-1');
    h3.textContent = feedName;

    const p = document.createElement('p');
    p.classList.add('mb-1');
    p.textContent = feedDescription;

    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-feed-id', feedId);
    li.append(h3, p);

    ul.prepend(li);
    formElement.reset();
  };

  const renderPosts = (posts) => {
    if (posts.length === 0) {
      postsContainerElement.innerHTML = '';
      return;
    }

    let ul = postsContainerElement.querySelector('ul');
    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = 'Posts';
      ul = document.createElement('ul');
      ul.classList.add('list-group');
      postsContainerElement.append(h2, ul);
    }

    const items = posts.map(({ postTitle, postLink, postId }) => {
      const a = document.createElement('a');
      a.setAttribute('href', postLink);
      a.textContent = postTitle;
      const li = document.createElement('li');
      li.setAttribute('data-feed-id', postId);
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
      );
      li.append(a);
      return li;
    });
    ul.prepend(...items);
    postsContainerElement.append(ul);
  };

  switch (path) {
    case 'form.valid':
      renderValidation(value);
      break;
    case 'form.validationError':
    case 'networkError':
      renderError(value);
      break;
    case 'feeds':
      renderFeeds(value);
      break;
    case 'posts':
      renderPosts(value);
      break;
    case 'form.processState':
      renderProcessStateMessage(value);
      break;
    case 'form.fields.rssLink':
      break;
    default:
      throw new Error(`Unknown statement ${path}`);
  }
};

export { makeRendering, renderText };
