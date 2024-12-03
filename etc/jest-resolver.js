const mjsResolver = (path, options) => {
  const mjsExtRegex = /\.js$/i
  const resolver = options.defaultResolver

  if (mjsExtRegex.test(path)) {
    try {
      return resolver(path.replace(mjsExtRegex, '.ts'), options)
    } catch (e) {
      // use default resolver
    }
  }

  return resolver(path, options)
}

module.exports = mjsResolver
