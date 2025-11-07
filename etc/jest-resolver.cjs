const mjsResolver = (path, options) => {
  const jsExtRegex = /\.js$/i
  const mjsExtRegex = /\.mjs$/i
  const clientMjsRegex = /\.client\.mjs$/i
  const resolver = options.defaultResolver

  // Handle .js -> .ts conversion for local files
  if (jsExtRegex.test(path) && !path.includes('node_modules')) {
    try {
      return resolver(path.replace(jsExtRegex, '.ts'), options)
    } catch (e) {
      // use default resolver
    }
  }

  // Handle .mjs imports from proto packages
  // For proto packages, we need to map .mjs files to their .ts source equivalents
  if (mjsExtRegex.test(path) && path.includes('@injectivelabs/')) {
    // Handle .client.mjs files
    if (clientMjsRegex.test(path)) {
      try {
        return resolver(path.replace(clientMjsRegex, '.client.ts'), options)
      } catch (e) {
        // try without .client
        try {
          return resolver(path.replace(clientMjsRegex, '.ts'), options)
        } catch (e2) {
          // continue to other attempts
        }
      }
    }

    // Handle regular .mjs files
    try {
      return resolver(path.replace(mjsExtRegex, '.ts'), options)
    } catch (e) {
      try {
        // Try with _pb.ts pattern
        return resolver(path.replace(mjsExtRegex, '_pb.ts'), options)
      } catch (e2) {
        // use default resolver
      }
    }
  }

  return resolver(path, options)
}

module.exports = mjsResolver
