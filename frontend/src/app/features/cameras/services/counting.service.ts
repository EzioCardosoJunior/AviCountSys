import { Injectable } from '@angular/core';

import { Detection } from '../models/detection';
import { CrossingDirection } from '../models/crossing-direction';

@Injectable({
    providedIn: 'root'
})
export class CountingService {

    private previousCenterY = -1;

    private totalCount = 0;

    private lastDirection = CrossingDirection.None;

    process(
        detections: Detection[],
        lineY: number
    ): void {

        if (detections.length === 0) {
            return;
        }

        const detection = detections[0];

        const centerY =
            detection.y + detection.height / 2;

        if (this.previousCenterY >= 0) {

            // Cima -> baixo

            if (

                this.previousCenterY < lineY &&
                centerY >= lineY

            ) {

                this.totalCount++;

                this.lastDirection =
                    CrossingDirection.Down;

            }

            // Baixo -> cima

            if (

                this.previousCenterY > lineY &&
                centerY <= lineY

            ) {

                this.totalCount++;

                this.lastDirection =
                    CrossingDirection.Up;

            }

        }

        this.previousCenterY = centerY;

    }

    getTotal(): number {

        return this.totalCount;

    }

    getLastDirection(): CrossingDirection {

        return this.lastDirection;

    }

    reset(): void {

        this.totalCount = 0;

        this.previousCenterY = -1;

        this.lastDirection =
            CrossingDirection.None;

    }

}