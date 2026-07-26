export interface Detection {

    id: number;

    classId: number;

    className: string;

    confidence: number;

    x: number;

    y: number;

    width: number;

    height: number;

}