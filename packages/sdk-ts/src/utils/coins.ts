export const parseCoins = (input: string) => {
  return input
    .replace(/\s/g, '')
    .split(',')
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^([0-9]+)([a-zA-Z][a-zA-Z0-9/]{2,127})$/)

      if (!match) throw new Error('Got an invalid coin string')

      return {
        amount: match[1].replace(/^0+/, '') || '0',
        denom: match[2],
      }
    })
}
