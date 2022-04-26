export enum TestnetNodes {
  sentry0 = 'sentry-0',
  sentry1 = 'sentry-1',
  k8s = 'k8s',
}

export enum MainnetNodes {
  sentry0 = 'sentry-0',
  sentry1 = 'sentry-1',
  sentry2 = 'sentry-2',
  sentry3 = 'sentry-3',
  sentryCd = 'sentry.cd',
  k8s = 'k8s',
  lb = 'lb',
}

export class Network {
  public sentryHttpApi

  public sentryGrpcApi

  public exchangeApi

  public feeDenom

  public chainId

  public env

  constructor({
    sentryHttpApi,
    sentryGrpcApi,
    exchangeApi,
    feeDenom,
    chainId,
    env,
  }: {
    sentryHttpApi: string
    sentryGrpcApi: string
    exchangeApi: string
    feeDenom: string
    chainId: string
    env: string
  }) {
    this.sentryHttpApi = sentryHttpApi
    this.sentryGrpcApi = sentryGrpcApi
    this.exchangeApi = exchangeApi
    this.feeDenom = feeDenom
    this.chainId = chainId
    this.env = env
  }

  static devnet(): Network {
    const params = {
      feeDenom: 'inj',
      chainId: 'injective-777',
      env: 'devnet',
    }

    return new Network({
      ...params,
      sentryHttpApi: 'https://devnet.lcd.injective.dev',
      sentryGrpcApi: 'https://devnet.injective.dev:9900',
      exchangeApi: 'https://devnet.injective.dev:9910',
    })
  }

  static local(): Network {
    const params = {
      feeDenom: 'inj',
      chainId: 'injective-1',
      env: 'local',
    }

    return new Network({
      ...params,
      sentryHttpApi: 'http://localhost:10337',
      sentryGrpcApi: 'http://localhost:9900',
      exchangeApi: 'http://localhost:9910',
    })
  }

  static testnet(node: TestnetNodes = TestnetNodes.k8s): Network {
    if (!Object.values(TestnetNodes).includes(node)) {
      throw new Error('Invalid testnet node')
    }

    const params = {
      feeDenom: 'inj',
      chainId: 'injective-888',
      env: 'testnet',
    }

    if (node === TestnetNodes.k8s) {
      return new Network({
        ...params,
        sentryHttpApi: `https://${node}.mainnet.lcd.injective.network`,
        sentryGrpcApi: `https://${node}.mainnet.chain.grpc.injective.network:443`,
        exchangeApi: `https://${node}.mainnet.exchange.grpc.injective.network:443`,
      })
    }

    return new Network({
      ...params,
      sentryHttpApi: 'https://testnet.lcd.injective.dev',
      sentryGrpcApi: `https://${node}.injective.dev:9900`,
      exchangeApi: `https://${node}.injective.dev:9910`,
    })
  }

  static mainnet(node: MainnetNodes = MainnetNodes.k8s): Network {
    if (!Object.values(MainnetNodes).includes(node)) {
      throw new Error('Invalid testnet node')
    }

    const params = {
      feeDenom: 'inj',
      chainId: 'injective-1',
      env: 'mainnet',
    }

    if (node === MainnetNodes.k8s || node === MainnetNodes.lb) {
      return new Network({
        ...params,
        sentryHttpApi: 'https://k8s.testnet.lcd.injective.network',
        sentryGrpcApi: 'https://k8s.testnet.chain.grpc.injective.network:443',
        exchangeApi: 'https://k8s.testnet.exchange.grpc.injective.network:443',
      })
    }

    return new Network({
      ...params,
      sentryHttpApi: 'https://lcd.injective.network',
      sentryGrpcApi: `https://${node}.injective.network:9900`,
      exchangeApi: `https://${node}.injective.network:9910`,
    })
  }
}
