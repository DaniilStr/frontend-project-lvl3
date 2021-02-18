import i18next from 'i18next';

const submitButtonElement = document.querySelector('button[type=submit]');
const hintElement = document.querySelector('.hint');
const mainTitleElement = document.querySelector('.mainTitle');
const promoElement = document.querySelector('.promo');
const inputElement = document.querySelector('input');
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

const renderText = (t) => {
  mainTitleElement.textContent = t('mainTitle');
  hintElement.textContent = t('example');
  submitButtonElement.textContent = t('addButton');
  inputElement.placeholder = t('placeholder');
  promoElement.textContent = t('promo');
};

const renderValidation = (valid) => {
  if (!valid) {
    inputElement.classList.add('is-invalid');
    submitButtonElement.classList.add('disabled');
    return;
  }
  inputElement.classList.remove('is-invalid');
  submitButtonElement.classList.remove('disabled');
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
    submitButtonElement.classList.add('disabled');
    feedbackElement.classList.add('text');
    feedbackElement.textContent = i18next.t(alert);
  }
  if (alert === 'filling') {
    submitButtonElement.classList.remove('disabled');
    feedbackElement.classList.add('text-success');
    feedbackElement.textContent = i18next.t(alert);
  }
};

const renderFeeds = (feeds) => {
  const feed = feeds[0];
  const { feedName, feedDescription, feedId } = feed;

  let ul = feedsContainerElement.querySelector('ul');
  if (!ul) {
    const h2 = document.createElement('h2');
    h2.textContent = i18next.t('Feeds');
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

const renderPosts = (posts) => {
  let ul = postsContainerElement.querySelector('ul');

  if (!ul) {
    const h2 = document.createElement('h2');
    h2.textContent = i18next.t('Posts');
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
    previewBtn.textContent = i18next.t('Preview');
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

const makeRendering = (path, value) => {
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
