import { Detection } from './detection';

export interface TrackedObject {

    id: number;

    detection: Detection;

    counted: boolean;

    lastCenterX: number;

    lastCenterY: number;

}