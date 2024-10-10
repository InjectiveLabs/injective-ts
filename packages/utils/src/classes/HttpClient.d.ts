import { AxiosRequestConfig } from 'axios';
export default class HttpClient {
    private readonly client;
    private config;
    constructor(endpoint: string, options?: Record<string, any>);
    setConfig(config: AxiosRequestConfig): HttpClient;
    get<T, P>(endpoint: string, params?: T): Promise<P>;
    post<T, P>(endpoint: string, data?: T): Promise<P>;
    put<T, P>(endpoint: string, data?: T): Promise<P>;
    delete<T, P>(endpoint: string, params?: T): Promise<P>;
}
//# sourceMappingURL=HttpClient.d.ts.map