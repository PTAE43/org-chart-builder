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

    // TResponse = type ของข้อมูลที่ "ได้กลับมา"
    get<TResponse>(url: string, params?: ApiParams) {
        return this.http.get<TResponse>(`${this.baseUrl}${url}`, { params });
    }

    // TResponse = response, TBody = type ของ body ที่ส่งขึ้นไป
    post<TResponse, TBody = unknown>(url: string, body: TBody) {
        return this.http.post<TResponse>(`${this.baseUrl}${url}`, body);
    }

    delete<TResponse>(url: string, params?: ApiParams) {
        return this.http.delete<TResponse>(`${this.baseUrl}${url}`, { params });
    }
}
