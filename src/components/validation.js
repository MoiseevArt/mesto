const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  validationConfig,
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)

  inputElement.classList.add(validationConfig.inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(validationConfig.errorClass)
}

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(validationConfig.inputErrorClass)
  errorElement.classList.remove(validationConfig.errorClass)
  errorElement.textContent = ''
}

const isValid = async (formElement, inputElement, validationConfig) => {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
    inputElement.setCustomValidity('')
  }

  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig,
    )
  } else {
    hideInputError(formElement, inputElement, validationConfig)
  }
}

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid
  })
}

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true
    buttonElement.classList.add(validationConfig.inactiveButtonClass)
  } else {
    buttonElement.disabled = false
    buttonElement.classList.remove(validationConfig.inactiveButtonClass)
  }
}

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector),
  )
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector,
  )

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', async () => {
      await isValid(formElement, inputElement, validationConfig)
      toggleButtonState(inputList, buttonElement, validationConfig)
    })
  })
}

const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector),
  )

  formList.forEach((formElement) => {
    setEventListeners(formElement, validationConfig)
  })
}

const clearValidation = async (profileForm, validationConfig) => {
  const localInputs = Array.from(
    profileForm.querySelectorAll(validationConfig.inputSelector),
  )
  for (const localInput of localInputs) {
    await isValid(profileForm, localInput, validationConfig)
    hideInputError(profileForm, localInput, validationConfig)
  }
  const localButton = profileForm.querySelector(
    validationConfig.submitButtonSelector,
  )
  toggleButtonState(localInputs, localButton, validationConfig)
}

export { enableValidation, clearValidation }
