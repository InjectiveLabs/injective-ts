import { HttpClient } from '@injectivelabs/utils'

export interface MetricProviderOptions {
  region?: string
  appEnv?: string
  nodeEnv?: string
}

const defaultOptions: MetricProviderOptions = {
  region: 'en',
  appEnv: process.env.APP_ENV,
  nodeEnv: process.env.NODE_ENV,
}

export class MetricsProvider {
  private httpClient: HttpClient

  public env: string

  public isProduction: boolean = false

  public region: string = 'en'

  constructor(options: MetricProviderOptions = defaultOptions) {
    this.httpClient = new HttpClient('https://telegraf.injective.dev/statsd')
    this.region = (options.region || defaultOptions.region) as string
    this.env = (options.appEnv || defaultOptions.appEnv) as string
    this.isProduction =
      (options.nodeEnv || defaultOptions.nodeEnv) === 'production'
  }

  static wrap = async <T>(
    promise: Promise<any>,
  ): Promise<{ response: T; duration: number }> => {
    const start = performance.now()

    const response = (await promise) as T

    const end = performance.now()

    return { response, duration: parseInt((end - start).toString(), 10) }
  }

  async sendAndRecord<T>(promise: Promise<T>, bucket: string): Promise<T> {
    try {
      const start = performance.now()
      const response = (await promise) as T
      const end = performance.now()
      const duration = parseInt((end - start).toString(), 10)

      this.record(bucket, duration)
      return response
    } catch (error: any) {
      this.recordError(bucket)
      throw error
    }
  }

  async sendAndRecordWithoutProbability<T>(
    promise: Promise<T>,
    bucket: string,
  ): Promise<T> {
    try {
      const start = performance.now()
      const response = (await promise) as T
      const end = performance.now()
      const duration = parseInt((end - start).toString(), 10)

      this.recordWithoutProbability(bucket, duration)
      return response
    } catch (error: any) {
      this.recordError(bucket)
      throw error
    }
  }

  record(bucket: string, duration: number) {
    if (this.recordMetrics()) {
      this.timing(bucket, duration)
      this.incr(bucket)
    }
  }

  recordWithoutProbability(bucket: string, duration: number) {
    if (this.recordMetricsWithoutProbability()) {
      this.timing(bucket, duration)
      this.incr(bucket)
    }
  }

  recordError(bucket: string) {
    this.incr(`${bucket}Errors`)
  }

  private async timing(bucket: string, duration: number) {
    return this.httpClient.post(`timing/${bucket}.timing`, {
      dur: duration,
      tags: `region=${this.region},env=${this.env}`,
    })
  }

  private async incr(bucket: string) {
    return this.httpClient.post(`incr/${bucket}.counter`, {
      tags: `region=${this.region},env=${this.env}`,
    })
  }

  async pageLoadTiming(page: string, duration: number) {
    return this.httpClient.post('timing/pageloads.timing', {
      dur: duration,
      tags: `region=${this.region},env=${this.env},page=${page}`,
    })
  }

  private recordMetrics(): boolean {
    return this.isProduction && Math.random() < 0.1
  }

  private recordMetricsWithoutProbability(): boolean {
    return this.isProduction
  }
}
