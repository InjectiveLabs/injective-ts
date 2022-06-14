import path from 'path'

export const getTokenLogoWithVendorPathPrefix = (image: string) => {
  if (image.includes('@injectivelabs')) {
    return image
  }

  if (image.includes('http')) {
    return image
  }

  return path.join('/', 'vendor', '@injectivelabs', 'token-metadata', image)
}
