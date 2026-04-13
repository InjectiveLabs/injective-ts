export function prepareSignBytes(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(prepareSignBytes)
  }

  // Handle BigInt - convert to string for JSON serialization
  if (typeof obj === 'bigint') {
    return obj.toString()
  }

  // string, number, or null
  if (typeof obj !== `object` || obj === null) {
    return obj
  }

  const sorted: any = {}

  Object.keys(obj)
    .sort()
    .forEach((key) => {
      if (obj[key] === undefined || obj[key] === null) return
      sorted[key] = prepareSignBytes(obj[key])
    })

  return sorted
}
