type SigningStargateClient =
  typeof import('@cosmjs/stargate').SigningStargateClient

let cachedSigningStargateClient: SigningStargateClient | null = null

export const loadSigningStargateClient =
  async (): Promise<SigningStargateClient> => {
    if (!cachedSigningStargateClient) {
      cachedSigningStargateClient = (await import('@cosmjs/stargate'))
        .SigningStargateClient
    }
    return cachedSigningStargateClient
  }
