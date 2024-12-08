import { createCard, deleteCard, toggleLikeButton } from './components/card.js'
import { handleOpenPopup, closePopup } from './components/modal.js'
import { enableValidation, clearValidation } from './components/validation.js'
import {
  fetchInitialCards,
  fetchUserData,
  updateUserData,
  createCardData,
  updateUserAvatar,
} from './components/api.js'

import './pages/index.css'

const profileName = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const placesList = document.querySelector('.places__list')
const editBtn = document.querySelector('.profile__edit-button')
const addBtn = document.querySelector('.profile__add-button')
const avatarProfile = document.querySelector('.profile__image')

const popupEdit = document.querySelector('.popup_type_edit')
const popupAdd = document.querySelector('.popup_type_new-card')
const popupCard = document.querySelector('.popup_type_image')
const editProfileForm = popupEdit.querySelector('form[name="edit-profile"]')
const profileNameInput = editProfileForm.querySelector('[name="name"]')
const profileDescriptionInput = editProfileForm.querySelector(
  '[name="description"]',
)
const newPlaceForm = document.querySelector('form[name="new-place"]')
const placeNameInput = newPlaceForm.querySelector('[name="place-name"]')
const placeLinkInput = newPlaceForm.querySelector('[name="link"]')
const popupEditAvatar = document.querySelector('.popup_type_edit-avatar')
const newAvatarForm = document.querySelector('form[name="new-avatar"]')
const linkAvatarInput = document.querySelector('[name="link-avatar"]')
const popupConfirm = document.querySelector('.popup_type_delete-card')
const buttonConfirm = popupConfirm.querySelector('.popup__button_type-delete')

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
}

let userId

popupEdit.classList.add('popup_is-animated')
popupAdd.classList.add('popup_is-animated')
popupCard.classList.add('popup_is-animated')
popupConfirm.classList.add('popup_is-animated')
popupEditAvatar.classList.add('popup_is-animated')

const initializeData = async () => {
  try {
    const [cardsResponse, userResponse] = await Promise.all([
      fetchInitialCards(),
      fetchUserData(),
    ])

    initialProfileInfo(userResponse)

    userId = userResponse._id

    cardsResponse.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        confirmDelete,
        toggleLikeButton,
        openImagePopup,
        userId,
      )

      placesList.append(cardElement)
    })
  } catch (error) {
    console.error(error)
  }
}

initializeData()

function initialProfileInfo(userResponse) {
  profileName.textContent = userResponse.name
  profileDescription.textContent = userResponse.about
  avatarProfile.style.backgroundImage = `url("${userResponse.avatar}")`
}

enableValidation(validationConfig)

function openImagePopup(evt) {
  handleOpenPopup(popupCard)

  const popupImage = popupCard.querySelector('img')
  popupImage.src = evt.target.src
  popupImage.alt = evt.target.alt

  const popupCaption = popupCard.querySelector('.popup__caption')
  popupCaption.textContent = evt.target.alt
}

document.addEventListener('click', (evt) => {
  if (evt.target === editBtn) {
    profileNameInput.value = profileName.textContent
    profileDescriptionInput.value = profileDescription.textContent
    handleOpenPopup(popupEdit)
    clearValidation(editProfileForm, validationConfig)
  } else if (evt.target === addBtn) {
    newPlaceForm.reset()
    handleOpenPopup(popupAdd)
    clearValidation(newPlaceForm, validationConfig)
  } else if (evt.target === avatarProfile) {
    newAvatarForm.reset()
    handleOpenPopup(popupEditAvatar)
    clearValidation(newAvatarForm, validationConfig)
  }
})

avatarProfile.addEventListener('click', () => {
  handleOpenPopup(popupEditAvatar)
})

popupEdit.addEventListener('submit', handleEditProfileSubmit)
popupAdd.addEventListener('submit', handleNewPlaceSubmit)
popupEditAvatar.addEventListener('submit', handleNewAvatarSubmit)

async function handleSubmit(evt, callback) {
  evt.preventDefault()
  const activeButton = evt.target.querySelector('.popup__button')
  const oldText = activeButton.textContent
  renderLoading(true, activeButton, oldText)

  try {
    await callback()
  } catch (error) {
    console.error('Ошибка:', error.message)
  } finally {
    renderLoading(false, activeButton, oldText)
  }
}

function renderLoading(isLoading, button, oldText) {
  button.textContent = isLoading ? 'Сохранение...' : oldText
}

async function handleNewPlaceSubmit(evt) {
  await handleSubmit(evt, async () => {
    const cardData = await addCardToServer(
      placeNameInput.value,
      placeLinkInput.value,
    )

    const cardElement = createCard(
      cardData,
      confirmDelete,
      toggleLikeButton,
      openImagePopup,
      userId,
    )

    placesList.prepend(cardElement)
    newPlaceForm.reset()
    closePopup(popupAdd)
  })
}

async function addCardToServer(nameCard, linkCard) {
  const cardData = {
    name: nameCard,
    link: linkCard,
  }
  try {
    const data = await createCardData(cardData)
    return data
  } catch (error) {
    console.error('Ошибка добавления карточки:', error.message)
  }
}

async function handleNewAvatarSubmit(evt) {
  await handleSubmit(evt, async () => {
    const linkAvatar = linkAvatarInput.value
    const result = await addAvatarToServer(linkAvatar)
    avatarProfile.style.backgroundImage = `url("${result.avatar}")`
    closePopup(popupEditAvatar)
    linkAvatarInput.value = ''
  })
}

async function addAvatarToServer(linkAvatar) {
  const avatarData = {
    avatar: linkAvatar,
  }
  try {
    const data = await updateUserAvatar(avatarData)
    return data
  } catch (error) {
    console.error('Ошибка обновления аватара:', error.message)
  }
}

function updateProfileInfo(data) {
  profileName.textContent = data.name
  profileDescription.textContent = data.about
}

async function handleEditProfileSubmit(evt) {
  await handleSubmit(evt, async () => {
    const userData = getUserDataFromInputs()
    const data = await updateUserData(userData)
    updateProfileInfo(data)
    closePopup(popupEdit)
  })
}

function getUserDataFromInputs() {
  return {
    name: profileNameInput.value,
    about: profileDescriptionInput.value,
  }
}

let currentCard

function confirmDelete(evt) {
  currentCard = evt.target.closest('.places__item')

  handleOpenPopup(popupConfirm)

  buttonConfirm.removeEventListener('click', handleClick)
  buttonConfirm.addEventListener('click', handleClick)
}

const handleClick = async (e) => {
  const activeButton = e.target
  const oldText = activeButton.textContent
  renderLoading(true, activeButton, oldText)

  try {
    await deleteCard(currentCard)
    closePopup(popupConfirm)
  } catch (error) {
    console.error('Ошибка при удалении карточки:', error)
  } finally {
    renderLoading(false, activeButton, oldText)
    closePopup(popupConfirm)
  }
}
