export const isTxNotFoundError = (error: any) => {
  if (!error.response) {
    const errorToString = error.toString()
    const acceptableErrorStrings = ['404', 'not found', 'timeout']

    return acceptableErrorStrings.some((code) => errorToString.includes(code))
  }

  const message = error.response.data
    ? error.response.data.message
    : error.toString()

  if (message.includes('404')) {
    return true
  }

  if (message.includes('not found')) {
    return true
  }

  return false
}

export const errorToErrorMessage = (error: any) => {
  if (!error.response) {
    return error.toString()
  }

  const message = error.response.data
    ? error.response.data.message
    : error.toString()

  return message
}
