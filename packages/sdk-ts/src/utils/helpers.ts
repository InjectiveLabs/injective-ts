export const isServerSide = () => typeof window === 'undefined'

export const objectToJson = (
  object: Record<string, any>,
  params?:
    | {
        replacer?: any
        indentation?: number
      }
    | undefined,
): string => {
  const { replacer, indentation } = params || { replacer: null, indentation: 2 }

  return JSON.stringify(object, replacer, indentation)
}

export const protoObjectToJson = (
  object: any,
  params?:
    | {
        replacer?: any
        indentation?: number
      }
    | undefined,
): string => {
  const { replacer, indentation } = params || { replacer: null, indentation: 2 }

  if (object.toObject !== undefined) {
    return JSON.stringify(object.toObject(), replacer, indentation)
  }

  return objectToJson(object, { replacer, indentation })
}
