export default (path, value, i18nextInstance) => {
  const inputElement = document.querySelector('.form-control');
  const submitButtonElement = document.querySelector('button[type=submit]');
  const feedbackElement = document.querySelector('.feedback');
  const formElement = document.querySelector('.rss-form');
  const feedsContainerElement = document.querySelector('.feeds');
  const postsContainerElement = document.querySelector('.posts');
  const modal = document.querySelector('.modal');
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticleBtn = document.querySelector('.full-article');
  const modalHeaderCloseBtn = document.querySelector('.modal-header button');
  const modalFooterCloseBtn = document.querySelector('.modal-footer button');

  const closeModal = () => {
    modalTitle.textContent = '';
    modalBody.textContent = '';
    fullArticleBtn.href = '';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('show');
    modal.removeAttribute('role');
    modal.style = 'display: none;';
    modal.tabindex = -1;
  };

  modalHeaderCloseBtn.addEventListener('click', () => {
    closeModal();
  });

  modalFooterCloseBtn.addEventListener('click', () => {
    closeModal();
  });

  const renderValidation = (valid) => {
    if (!valid) {
      inputElement.classList.add('is-invalid');
      // submitButtonElement.classList.add('disabled');
      return;
    }
    inputElement.classList.remove('is-invalid');
    // submitButtonElement.classList.remove('disabled');
  };

  const renderError = (err) => {
    inputElement.classList.remove('is-invalid');
    feedbackElement.classList.remove('text-danger');
    feedbackElement.innerHTML = '';
    if (err === null) return;
    const { message } = err;
    inputElement.classList.add('is-invalid');
    feedbackElement.textContent = i18nextInstance.t(message);
    feedbackElement.classList.add('text-danger');
  };

  const renderProcessStateMessage = (alert) => {
    feedbackElement.classList.remove('text', 'text-danger', 'text-success');
    if (alert === 'processing') {
      submitButtonElement.setAttribute('disabled', 'disabled');
      inputElement.setAttribute('readonly', true);
      feedbackElement.classList.add('text');
      feedbackElement.textContent = i18nextInstance.t(alert);
    }
    if (alert === 'failed') {
      inputElement.removeAttribute('readonly');
      submitButtonElement.removeAttribute('disabled');
      // submitButtonElement.classList.remove('disabled');
      feedbackElement.classList.add('text-danger');
    }
    if (alert === 'filling') {
      inputElement.removeAttribute('readonly');
      submitButtonElement.removeAttribute('disabled');
      // submitButtonElement.classList.remove('disabled');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = i18nextInstance.t(alert);
    }
  };

  const renderModal = (title, description, link) => {
    // ----- safely (XSS) -----
    // modalTitle.textContent = title;
    // modalBody.textContent = description;

    modalTitle.insertAdjacentHTML('afterbegin', title);
    modalBody.insertAdjacentHTML('afterbegin', description);

    fullArticleBtn.href = link;
    modal.removeAttribute('aria-hidden');
    modal.classList.add('show');
    modal.style = 'display: block; padding-right: 12px; overflow: auto;';
    modal.tabindex = 1;
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
  };

  const renderFeeds = (feeds) => {
    const feed = feeds[0];
    const { feedName, feedDescription, feedId } = feed;

    const createUl = () => {
      const h2 = document.createElement('h2');
      h2.textContent = i18nextInstance.t('Feeds');
      const ul = document.createElement('ul');
      ul.classList.add('list-group', 'mb-5');
      feedsContainerElement.append(h2, ul);
      return ul;
    };
    const ul = feedsContainerElement.querySelector('ul') ? feedsContainerElement.querySelector('ul') : createUl();

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
    const createUl = () => {
      const h2 = document.createElement('h2');
      h2.textContent = i18nextInstance.t('Posts');
      const ul = document.createElement('ul');
      ul.classList.add('list-group');
      postsContainerElement.append(h2, ul);
      return ul;
    };

    const ul = postsContainerElement.querySelector('ul') ? postsContainerElement.querySelector('ul') : createUl();

    const items = posts.map(({
      postTitle, postDescription, postLink, postId,
    }) => {
      const a = document.createElement('a');
      a.setAttribute('href', postLink);
      a.setAttribute('target', '_blank');
      a.classList.add('font-weight-bold');
      a.textContent = postTitle;
      a.addEventListener('click', () => {
        a.classList.remove('font-weight-bold');
        a.classList.add('font-weight-normal');
      });

      const li = document.createElement('li');
      li.setAttribute('data-feed-id', postId);
      li.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
      );

      const previewBtn = document.createElement('button');
      previewBtn.textContent = i18nextInstance.t('Preview');
      previewBtn.classList.add('btn', 'btn-primary', 'btn-md');
      previewBtn.setAttribute('type', 'button');
      previewBtn.setAttribute('data-toggle', 'modal');
      previewBtn.setAttribute('data-target', '#modal');
      previewBtn.addEventListener('click', () => {
        a.classList.remove('font-weight-bold');
        a.classList.add('font-weight-normal');
        renderModal(postTitle, postDescription, postLink, a);
      });
      li.append(a, previewBtn);
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
