import path from 'path'

export const getTokenLogoWithVendorPathPrefix = (image: string) => {
  if (image.includes('@injectivelabs')) {
    return image
  }

  if (image.includes('http')) {
    return image
  }

  if (image.includes('bridgingNetworks')) {
    return image
  }

  if (image === 'ibc') {
    return path.join(
      '/',
      'vendor',
      '@injectivelabs',
      'token-metadata',
      'ibc.svg',
    )
  }

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}
