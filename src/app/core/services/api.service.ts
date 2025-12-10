import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

type ApiParams = {
    [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    get<T>(url: string, params?: ApiParams) {
        return this.http.get<T>(`${this.baseUrl}${url}`, { params });
    }

    post<TResponse, TBody = unknown>(url: string, body: TBody) {
        return this.http.post<TResponse>(`${this.baseUrl}${url}`, body);
    }

    delete<T>(url: string, params?: ApiParams) {
        return this.http.delete<T>(`${this.baseUrl}${url}`, { params });
    }
}
