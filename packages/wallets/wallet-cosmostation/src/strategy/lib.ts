type MakeSignDoc = typeof import('@cosmjs/proto-signing').makeSignDoc

let cachedMakeSignDoc: MakeSignDoc | null = null

export const loadMakeSignDoc = async (): Promise<MakeSignDoc> => {
  if (!cachedMakeSignDoc) {
    cachedMakeSignDoc = (await import('@cosmjs/proto-signing')).makeSignDoc
  }

  return cachedMakeSignDoc
}
