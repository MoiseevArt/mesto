function handleOpenPopup(popupElement) {
  openPopup(popupElement)
  popupElement.addEventListener('click', handlePopupCloseClick)
  document.addEventListener('keydown', handleEscKeydown)
}

function openPopup(popupElement) {
  popupElement.classList.remove('popup_is-animated')
  popupElement.classList.add('popup_is-opened')
}

function handlePopupCloseClick(evt) {
  const popupElement = evt.target.closest('.popup')
  if (
    evt.target.classList.contains('popup__close') ||
    !evt.target.closest('.popup__content')
  ) {
    closePopup(popupElement)
  }
}

function handleEscKeydown(evt) {
  if (evt.key === 'Escape') {
    const popupElement = document.querySelector('.popup.popup_is-opened')
    closePopup(popupElement)
  }
}

function closePopup(popupElement) {
  popupElement.classList.add('popup_is-animated')
  popupElement.classList.remove('popup_is-opened')
  popupElement.removeEventListener('click', handlePopupCloseClick)
  document.removeEventListener('keydown', handleEscKeydown)
}

export { handleOpenPopup, closePopup }
