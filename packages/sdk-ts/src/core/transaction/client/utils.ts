export const isTxNotFoundError = (error: any) => {
  if (!error.response) {
    const errorToString = error.toString()
    const acceptableErrorCodes = ['404']

    return acceptableErrorCodes.some((code) => errorToString.includes(code))
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
