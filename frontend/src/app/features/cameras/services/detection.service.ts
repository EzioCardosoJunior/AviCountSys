import { Injectable } from '@angular/core';

import { Detection } from '../models/detection';
import { FrameResult } from '../models/frame-result';

@Injectable({
  providedIn: 'root'
})
export class DetectionService {

  private x = 100;
  private y = 180;
  private direction = 2;
  private directionY = 1.5;

  detect(): FrameResult {

    this.x += this.direction;

    this.y += this.directionY;

    if (this.x > 700) {

      this.direction = -2;

    }

    if (this.x < 100) {

      this.direction = 2;

    }

    if (this.y > 420) {

      this.directionY = -1.5;

    }

    if (this.y < 60) {

      this.directionY = 1.5;

    }

    const detections: Detection[] = [

      {

        id: 1,

        classId: 0,

        className: 'Aves',

        confidence: 0.98,

        x: this.x,

        y: this.y,

        width: 110,

        height: 80

      }

    ];

    return {

      detections,

      processingTime: 6

    };

  }

}