const config = {
  baseUrl: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
  headers: {
    authorization: '9ec4964b-a46e-4c82-90ef-5859d7fc7546',
    'Content-Type': 'application/json',
  },
}

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error('Ошибка загрузки данных')
  }
  return response.json()
}

const fetchInitialCards = async () => {
  const res = await fetch(`${config.baseUrl}/cards`, {
    method: 'GET',
    headers: config.headers,
  })
  return handleResponse(res)
}

const fetchUserData = async () => {
  const res = await fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers,
  })
  return handleResponse(res)
}

const updateUserData = async (userData) => {
  const res = await fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(userData),
  })
  return handleResponse(res)
}

const createCardData = async (cardData) => {
  const res = await fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(cardData),
  })
  return handleResponse(res)
}

const updateUserAvatar = async (avatarData) => {
  const res = await fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify(avatarData),
  })
  return handleResponse(res)
}

const sendDeleteCardRequest = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  return handleResponse(res)
}

const sendLikeDeletionData = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
  })
  return handleResponse(res)
}

const sendLikePutData = async (cardId) => {
  const res = await fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
  })
  return handleResponse(res)
}

export {
  fetchInitialCards,
  fetchUserData,
  updateUserData,
  createCardData,
  updateUserAvatar,
  sendDeleteCardRequest,
  sendLikeDeletionData,
  sendLikePutData,
}
