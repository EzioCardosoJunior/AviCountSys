import { Detection } from './detection';

export interface FrameResult {

    detections: Detection[];

    processingTime: number;

}