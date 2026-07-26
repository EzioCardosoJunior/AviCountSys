import { Injectable } from '@angular/core';

import { Detection } from '../models/detection';
import { TrackedObject } from '../models/tracked-object';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {

  private objects: TrackedObject[] = [];

  private nextId = 1;

  private readonly maxDistance = 80;

  update(detections: Detection[]): TrackedObject[] {

    const updated: TrackedObject[] = [];

    for (const detection of detections) {

      const centerX = detection.x + detection.width / 2;

      const centerY = detection.y + detection.height / 2;

      let nearest: TrackedObject | undefined;

      let nearestDistance = Number.MAX_VALUE;

      for (const object of this.objects) {

        const dx = centerX - object.lastCenterX;

        const dy = centerY - object.lastCenterY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < nearestDistance &&
          distance < this.maxDistance
        ) {

          nearestDistance = distance;

          nearest = object;

        }

      }

      if (nearest) {

        nearest.detection = detection;

        nearest.lastCenterX = centerX;

        nearest.lastCenterY = centerY;

        updated.push(nearest);

      } else {

        updated.push({

          id: this.nextId++,

          detection,

          counted: false,

          lastCenterX: centerX,

          lastCenterY: centerY

        });

      }

    }

    this.objects = updated;

    return this.objects;

  }

}