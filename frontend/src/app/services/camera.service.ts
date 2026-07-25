import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Camera } from '../models/camera';

@Injectable({
    providedIn: 'root'
})
export class CameraService {

    getAll(): Observable<Camera[]> {

        return of([
            {
                id: 1,
                nome: 'Porta Galpão 1',
                localizacao: 'Entrada',
                tipo: 'USB',
                origem: '0',
                largura: 1920,
                altura: 1080,
                fps: 30,
                ativo: true
            }
        ]);

    }

}