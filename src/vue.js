export default (path, value, t, domElements) => {
  const {
    submitButtonElement,
    inputElement,
    feedbackElement,
    formElement,
    feedsContainerElement,
    postsContainerElement,
    modal,
    modalTitle,
    modalBody,
    fullArticleBtn,
    modalHeaderCloseBtn,
    modalFooterCloseBtn,
  } = domElements;

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
    if (inputElement) {
      if (!valid) {
        inputElement.classList.add('is-invalid');
        submitButtonElement.classList.add('disabled');
        return;
      }
      inputElement.classList.remove('is-invalid');
      submitButtonElement.classList.remove('disabled');
    }
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
    console.log('message', message);
    feedbackElement.innerHTML = t([message, 'default']);
    feedbackElement.classList.add('text-danger');
  };

  const renderProcessStateMessage = (alert) => {
    feedbackElement.classList.remove('text', 'text-danger', 'text-success');
    feedbackElement.textContent = '';
    if (alert === 'processing') {
      submitButtonElement.classList.add('disabled');
      feedbackElement.classList.add('text');
      feedbackElement.textContent = t(alert);
    }
    if (alert === 'filling') {
      submitButtonElement.classList.remove('disabled');
      feedbackElement.classList.add('text-success');
      feedbackElement.textContent = t(alert);
    }
  };

  const renderModal = (title, description, link, a) => {
    modalTitle.textContent = title;
    modalBody.textContent = description;
    fullArticleBtn.href = link;
    fullArticleBtn.addEventListener('click', () => {
      a.classList.remove('font-weight-bold');
      a.classList.add('font-weight-normal');
    });
    modal.removeAttribute('aria-hidden');
    modal.classList.add('show');
    modal.style = 'display: block; padding-right: 12px;';
    modal.tabindex = 1;
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
  };

  const renderFeeds = (feeds) => {
    const feed = feeds[0];
    const { feedName, feedDescription, feedId } = feed;

    let ul = feedsContainerElement.querySelector('ul');
    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = t('Feeds');
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
    let ul = postsContainerElement.querySelector('ul');

    if (!ul) {
      const h2 = document.createElement('h2');
      h2.textContent = t('Posts');
      ul = document.createElement('ul');
      ul.classList.add('list-group');
      postsContainerElement.append(h2, ul);
    }

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
      previewBtn.textContent = t('Preview');
      previewBtn.classList.add('btn', 'btn-primary', 'btn-md');
      previewBtn.setAttribute('type', 'button');
      previewBtn.setAttribute('data-toggle', 'modal');
      previewBtn.setAttribute('data-target', '#modal');
      previewBtn.addEventListener('click', () => {
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
