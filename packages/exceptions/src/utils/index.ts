export const toPascalCase = (str: string): string =>
  `${str}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3}`,
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase())

export const formatNotificationDescription = (description: string) => {
  const DESCRIPTION_CHARACTER_LIMIT = 50

  if (description.length <= DESCRIPTION_CHARACTER_LIMIT) {
    return {
      description,
      tooltip: '',
    }
  }

  return {
    description: description.slice(0, DESCRIPTION_CHARACTER_LIMIT) + ' ...',
    tooltip: description,
  }
}
