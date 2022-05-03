export const isServerSide = () => typeof window === 'undefined'

export const objectToJson = (
  object: Record<string, any>,
  replacer = null,
  indentation = 2,
): string => {
  return JSON.stringify(object, replacer, indentation)
}
