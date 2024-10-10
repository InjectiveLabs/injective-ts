import { AxiosRequestConfig } from 'axios';
import HttpClient from './HttpClient';
/**
 * @hidden
 */
export default class HttpRestClient {
    protected client: HttpClient;
    protected endpoint: string;
    constructor(endpoint: string, options?: Record<string, any>);
    setConfig(config: AxiosRequestConfig): HttpRestClient;
    get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
    post<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
}
//# sourceMappingURL=HttpRestClient.d.ts.map