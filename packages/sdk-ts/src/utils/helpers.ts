export const isServerSide = () => typeof window === 'undefined'

export const objectToJson = (
  object: Record<string, any>,
  {
    replacer = null,
    indentation = 2,
  }: {
    replacer?: any
    indentation?: number
  },
): string => {
  return JSON.stringify(object, replacer, indentation)
}

export const protoObjectToJson = (
  object: any,
  {
    replacer = null,
    indentation = 2,
  }: {
    replacer?: any
    indentation?: number
  },
): string => {
  if (object.toObject !== undefined) {
    return JSON.stringify(object.toObject(), replacer, indentation)
  }

  return objectToJson(object, { replacer, indentation })
}
