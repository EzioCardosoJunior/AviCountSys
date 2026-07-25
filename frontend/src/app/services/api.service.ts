import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response';
import { Status } from '../models/status';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API =
        'https://impulso247.com.br/testeagro/backend';

    constructor(private http: HttpClient) { }

    getStatus(): Observable<ApiResponse<Status>> {

        return this.http.get<ApiResponse<Status>>(
            `${this.API}/index.php?action=status`
        );

    }


}