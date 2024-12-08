import {
  sendDeleteCardRequest,
  sendLikeDeletionData,
  sendLikePutData,
} from './api.js'

const createCard = (
  cardData,
  confirmDelete,
  toggleLikeButton,
  openImagePopup,
  userId,
) => {
  const template = document.querySelector('#card-template').content
  const cardElement = template.querySelector('.places__item').cloneNode('true')
  const imageElement = cardElement.querySelector('.card__image')
  const deleteButton = cardElement.querySelector('.card__delete-button')
  const likeButton = cardElement.querySelector('.card__like-button')
  const counterLikes = cardElement.querySelector('.card__like-counter')

  imageElement.src = `${cardData.link}`
  imageElement.alt = `${cardData.name}`

  cardElement.setAttribute('id', `${cardData._id}`)
  cardElement.querySelector('.card__title').textContent = `${cardData.name}`

  if (userId !== cardData.owner._id) {
    deleteButton.remove()
  }

  initialLikes(counterLikes, cardData)
  initialLikesButtonState(likeButton, cardData, userId)

  imageElement.addEventListener('click', openImagePopup)
  deleteButton.addEventListener('click', confirmDelete)
  likeButton.addEventListener('click', toggleLikeButton)

  return cardElement
}

function initialLikesButtonState(likeButton, cardData, userId) {
  const userLiked = cardData.likes.some((users) => users._id === userId)

  if (userLiked) {
    likeButton.classList.add('card__like-button_is-active')
  }
}

function initialLikes(counterLikes, cardData) {
  counterLikes.textContent = cardData.likes.length
}

async function deleteCard(currentCard) {
  try {
    await sendDeleteCardRequest(currentCard.id)
    currentCard.remove()
    return true
  } catch (err) {
    console.error('Ошибка при удалении карточки:', err)
    throw new Error('Ошибка при удалении карточки: ' + err.message)
  }
}

async function toggleLikeButton(evt) {
  const currentLikeButton = evt.target
  const checkSuccess = await sendLikeStatus(currentLikeButton)
  if (checkSuccess) {
    currentLikeButton.classList.toggle('card__like-button_is-active')
  }
}

async function sendLikeStatus(currentLikeButton) {
  const currentCard = currentLikeButton.closest('.card')
  try {
    const likeMethod = currentLikeButton.classList.contains(
      'card__like-button_is-active',
    )
      ? sendLikeDeletionData
      : sendLikePutData
    const cardData = await likeMethod(currentCard.id)
    renderLikeCounter(cardData, currentCard)
    return true
  } catch (error) {
    console.error('Ошибка при обновлении статуса лайка:', error)
    return false
  }
}

function renderLikeCounter(cardData, currentCard) {
  const likeCount = cardData.likes.length
  const counterLikes = currentCard.querySelector('.card__like-counter')
  counterLikes.textContent = likeCount
}

export { createCard, deleteCard, toggleLikeButton }
