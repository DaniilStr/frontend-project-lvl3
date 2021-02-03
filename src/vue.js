export default (path, value) => {
  const inputElement = document.querySelector('input');
  const feedbackElement = document.querySelector('.feedback');
  const button = document.querySelector('button');
  const form = document.querySelector('.rss-form');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  const renderValidation = (valid) => {
    if (!valid) {
      inputElement.classList.add('is-invalid');
      button.classList.add('disabled');
      return;
    }
    inputElement.classList.remove('is-invalid');
    button.classList.remove('disabled');
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
    feedbackElement.innerHTML = message;
    feedbackElement.classList.add('text-danger');
  };

  const renderProcessStateMessage = (alert) => {
    feedbackElement.classList.remove('text', 'text-danger', 'text-success');
    feedbackElement.textContent = '';
    if (alert === 'processing') {
      button.classList.add('disabled');
      feedbackElement.classList.add('text');
      feedbackElement.textContent = alert;
    }
    if (alert === 'filling') {
      button.classList.remove('disabled');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = alert;
    }
  };

  const renderFeeds = (feeds) => {
    if (feeds.length === 0) {
      feedsContainer.innerHTML = '';
      return;
    }

    const feed = feeds[0];
    const { feedName, feedDescription, feedId } = feed;

    let ul = feedsContainer.querySelector('ul');
    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = 'Feeds';
      ul = document.createElement('ul');
      ul.classList.add('list-group', 'mb-5');
      feedsContainer.append(h2, ul);
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
    form.reset();
  };

  const renderPosts = (posts) => {
    if (posts.length === 0) {
      postsContainer.innerHTML = '';
      return;
    }

    let ul = postsContainer.querySelector('ul');
    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = 'Posts';
      ul = document.createElement('ul');
      ul.classList.add('list-group');
      postsContainer.append(h2, ul);
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
    postsContainer.append(ul);
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
