import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ResizeHandle } from '../../features/cameras/models/resize-handle';
import { DetectionService } from '../../features/cameras/services/detection.service';
import { Detection } from '../../features/cameras/models/detection';
import { CrossingDirection } from '../../features/cameras/models/crossing-direction';
import { CountingService } from '../../features/cameras/services/counting.service';

@Component({
  selector: 'app-camera-canvas',
  standalone: true,
  templateUrl: './camera-canvas.html',
  styleUrl: './camera-canvas.scss'
})
export class CameraCanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild('video', { static: true })
  video!: ElementRef<HTMLVideoElement>;

  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private detectionService: DetectionService,
    private countingService: CountingService
  ) { }

  // Mouse
  mouseX = 0;
  mouseY = 0;

  // Linha
  lineY = 300;

  // ROI
  roiX = 150;
  roiY = 100;
  roiWidth = 400;
  roiHeight = 300;

  // Exibição
  showLine = true;
  showROI = true;
  showCoordinates = true;

  // Arrastes
  private draggingLine = false;
  private draggingROI = false;

  private readonly dragTolerance = 30;

  private roiOffsetX = 0;
  private roiOffsetY = 0;

  private context!: CanvasRenderingContext2D;

  private animationId = 0;

  private resizing = ResizeHandle.None;

  private readonly handleSize = 10;
  private detections: Detection[] = [];
  showDebug = true;
  private fps = 0;
  private lastFrameTime = performance.now();

  private processingTime = 0;
  async ngAfterViewInit(): Promise<void> {

    this.registerEvents();

    try {

      const stream = await navigator.mediaDevices.getUserMedia({

        video: true,
        audio: false

      });

      this.video.nativeElement.srcObject = stream;

      await this.video.nativeElement.play();

      this.canvas.nativeElement.width =
        this.video.nativeElement.videoWidth;

      this.canvas.nativeElement.height =
        this.video.nativeElement.videoHeight;

      this.context =
        this.canvas.nativeElement.getContext('2d')!;

      this.lineY = this.canvas.nativeElement.height / 2;

      this.render();

    }
    catch (e) {

      console.error(e);

    }

  }

  ngOnDestroy(): void {

    cancelAnimationFrame(this.animationId);

    const stream =
      this.video.nativeElement.srcObject as MediaStream;

    if (stream) {

      stream.getTracks().forEach(t => t.stop());

    }

  }

  //=====================================================
  // Eventos
  //=====================================================

  private registerEvents(): void {

    const canvas = this.canvas.nativeElement;

    canvas.addEventListener('mousemove', this.onMouseMove);

    canvas.addEventListener('mousedown', this.onMouseDown);

    canvas.addEventListener('mouseup', this.onMouseUp);

    canvas.addEventListener('mouseleave', this.onMouseLeave);

  }

  private onMouseMove = (event: MouseEvent): void => {

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const scaleX =
      this.canvas.nativeElement.width / rect.width;

    const scaleY =
      this.canvas.nativeElement.height / rect.height;

    this.mouseX =
      (event.clientX - rect.left) * scaleX;

    this.mouseY =
      (event.clientY - rect.top) * scaleY;

    //==================================================
    // Redimensionamento da ROI
    //==================================================

    if (this.resizing !== ResizeHandle.None) {

      const minWidth = 80;
      const minHeight = 80;

      switch (this.resizing) {

        case ResizeHandle.TopLeft:

          if (this.mouseX < this.roiX + this.roiWidth - minWidth) {

            this.roiWidth += this.roiX - this.mouseX;
            this.roiX = this.mouseX;

          }

          if (this.mouseY < this.roiY + this.roiHeight - minHeight) {

            this.roiHeight += this.roiY - this.mouseY;
            this.roiY = this.mouseY;

          }

          break;

        case ResizeHandle.TopRight:

          this.roiWidth = Math.max(
            minWidth,
            this.mouseX - this.roiX
          );

          if (this.mouseY < this.roiY + this.roiHeight - minHeight) {

            this.roiHeight += this.roiY - this.mouseY;
            this.roiY = this.mouseY;

          }

          break;

        case ResizeHandle.BottomLeft:

          if (this.mouseX < this.roiX + this.roiWidth - minWidth) {

            this.roiWidth += this.roiX - this.mouseX;
            this.roiX = this.mouseX;

          }

          this.roiHeight = Math.max(
            minHeight,
            this.mouseY - this.roiY
          );

          break;

        case ResizeHandle.BottomRight:

          this.roiWidth = Math.max(
            minWidth,
            this.mouseX - this.roiX
          );

          this.roiHeight = Math.max(
            minHeight,
            this.mouseY - this.roiY
          );

          break;

      }

      // Não deixa sair do canvas

      this.roiX = Math.max(0, this.roiX);
      this.roiY = Math.max(0, this.roiY);

      this.roiWidth = Math.min(
        this.roiWidth,
        this.canvas.nativeElement.width - this.roiX
      );

      this.roiHeight = Math.min(
        this.roiHeight,
        this.canvas.nativeElement.height - this.roiY
      );

      // Mantém a linha dentro da ROI

      this.lineY = Math.max(
        this.roiY,
        Math.min(
          this.lineY,
          this.roiY + this.roiHeight
        )
      );

      return;

    }
    //==================================================
    // Move linha
    //==================================================

    if (this.draggingLine) {

      this.lineY = Math.max(

        this.roiY,

        Math.min(

          this.mouseY,

          this.roiY + this.roiHeight

        )

      );

      return;

    }

    //==================================================
    // Move ROI
    //==================================================

    if (this.draggingROI) {

      this.roiX = Math.max(

        0,

        Math.min(

          this.mouseX - this.roiOffsetX,

          this.canvas.nativeElement.width - this.roiWidth

        )

      );

      this.roiY = Math.max(

        0,

        Math.min(

          this.mouseY - this.roiOffsetY,

          this.canvas.nativeElement.height - this.roiHeight

        )

      );

      // Mantém a linha dentro da ROI
      this.lineY = Math.max(
        this.roiY,
        Math.min(this.lineY, this.roiY + this.roiHeight)
      );

    }
    this.updateCursor(this.mouseX, this.mouseY);

  };

  private onMouseDown = (event: MouseEvent): void => {

    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const scaleX =
      this.canvas.nativeElement.width / rect.width;

    const scaleY =
      this.canvas.nativeElement.height / rect.height;

    const x =
      (event.clientX - rect.left) * scaleX;

    const y =
      (event.clientY - rect.top) * scaleY;

    //==================================================
    // 1 - Handles (prioridade máxima)
    //==================================================

    const handle = this.hitHandle(x, y);

    if (handle !== ResizeHandle.None) {

      this.resizing = handle;

      return;

    }

    //==================================================
    // 2 - Linha de contagem
    //==================================================

    if (

      x >= this.roiX &&
      x <= this.roiX + this.roiWidth &&
      Math.abs(y - this.lineY) <= this.dragTolerance

    ) {

      this.draggingLine = true;

      return;

    }

    //==================================================
    // 3 - ROI
    //==================================================

    if (this.isInsideROI(x, y)) {

      this.draggingROI = true;

      this.roiOffsetX = x - this.roiX;

      this.roiOffsetY = y - this.roiY;

    }

  };

  private onMouseUp = (): void => {

    this.draggingLine = false;

    this.draggingROI = false;

    this.resizing = ResizeHandle.None;

  };

  private onMouseLeave = (): void => {

    this.draggingLine = false;

    this.draggingROI = false;

    this.resizing = ResizeHandle.None;

  };

  //=====================================================
  // Auxiliares
  //=====================================================

  private isInsideROI(x: number, y: number): boolean {

    return (

      x >= this.roiX &&
      x <= this.roiX + this.roiWidth &&
      y >= this.roiY &&
      y <= this.roiY + this.roiHeight

    );

  }


  private hitHandle(x: number, y: number): ResizeHandle {

    const hs = this.handleSize;

    if (
      Math.abs(x - this.roiX) <= hs &&
      Math.abs(y - this.roiY) <= hs
    ) {
      return ResizeHandle.TopLeft;
    }

    if (
      Math.abs(x - (this.roiX + this.roiWidth)) <= hs &&
      Math.abs(y - this.roiY) <= hs
    ) {
      return ResizeHandle.TopRight;
    }

    if (
      Math.abs(x - this.roiX) <= hs &&
      Math.abs(y - (this.roiY + this.roiHeight)) <= hs
    ) {
      return ResizeHandle.BottomLeft;
    }

    if (
      Math.abs(x - (this.roiX + this.roiWidth)) <= hs &&
      Math.abs(y - (this.roiY + this.roiHeight)) <= hs
    ) {
      return ResizeHandle.BottomRight;
    }

    return ResizeHandle.None;

  }

  private updateCursor(x: number, y: number): void {

    const canvas = this.canvas.nativeElement;

    const handle = this.hitHandle(x, y);

    switch (handle) {

      case ResizeHandle.TopLeft:
      case ResizeHandle.BottomRight:

        canvas.style.cursor = 'nwse-resize';
        return;

      case ResizeHandle.TopRight:
      case ResizeHandle.BottomLeft:

        canvas.style.cursor = 'nesw-resize';
        return;

    }

    // Linha

    if (

      x >= this.roiX &&
      x <= this.roiX + this.roiWidth &&
      Math.abs(y - this.lineY) <= this.dragTolerance

    ) {

      canvas.style.cursor = 'ns-resize';
      return;

    }

    // ROI

    if (this.isInsideROI(x, y)) {

      canvas.style.cursor = 'move';
      return;

    }

    canvas.style.cursor = 'default';

  }

  //=====================================================
  // Render
  //=====================================================

  private render(): void {
    const now = performance.now();

    this.fps = Math.round(1000 / (now - this.lastFrameTime));

    this.lastFrameTime = now;

    this.drawFrame();

    const result = this.detectionService.detect();

    this.detections = result.detections;

    this.processingTime = result.processingTime;

    this.drawDetections();

    this.countingService.process(
      this.detections,
      this.lineY
    );

    if (this.showROI)
      this.drawROI();

    if (this.showLine)
      this.drawCountingLine();

    if (this.showCoordinates)
      this.drawCoordinates();

    this.drawROIInfo();
    this.drawDebug();
    this.animationId =
      requestAnimationFrame(() => this.render());

  }

  private drawFrame(): void {

    this.context.drawImage(

      this.video.nativeElement,

      0,

      0,

      this.canvas.nativeElement.width,

      this.canvas.nativeElement.height

    );

  }

  private drawDetections(): void {

    this.context.lineWidth = 2;

    this.context.font = '16px Arial';

    for (const detection of this.detections) {

      this.context.strokeStyle = '#00FFFF';

      this.context.strokeRect(

        detection.x,

        detection.y,

        detection.width,

        detection.height

      );

      this.context.fillStyle = '#00FFFF';

      this.context.fillText(

        `${detection.className} ${(detection.confidence * 100).toFixed(1)}%`,

        detection.x,

        detection.y - 8

      );

    }

  }


  private drawROI(): void {

    this.context.strokeStyle = '#FF0000';
    this.context.lineWidth = 2;

    this.context.strokeRect(
      this.roiX,
      this.roiY,
      this.roiWidth,
      this.roiHeight
    );

    this.context.fillStyle = 'rgba(255,0,0,0.08)';
    this.context.fillRect(
      this.roiX,
      this.roiY,
      this.roiWidth,
      this.roiHeight
    );

    this.context.fillStyle = '#FF0000';
    this.context.font = '16px Arial';
    this.context.fillText(
      'ROI',
      this.roiX + 8,
      this.roiY - 8
    );

    // Handles
    this.drawHandle(this.roiX, this.roiY);
    this.drawHandle(this.roiX + this.roiWidth, this.roiY);
    this.drawHandle(this.roiX, this.roiY + this.roiHeight);
    this.drawHandle(this.roiX + this.roiWidth, this.roiY + this.roiHeight);

  }

  private drawHandle(x: number, y: number): void {

    this.context.fillStyle = '#FFFFFF';

    this.context.fillRect(
      x - this.handleSize / 2,
      y - this.handleSize / 2,
      this.handleSize,
      this.handleSize
    );

    this.context.strokeStyle = '#000000';

    this.context.strokeRect(
      x - this.handleSize / 2,
      y - this.handleSize / 2,
      this.handleSize,
      this.handleSize
    );

  }

  private drawCountingLine(): void {

    this.context.strokeStyle = '#00FF00';

    this.context.lineWidth = 3;

    this.context.beginPath();

    this.context.moveTo(

      this.roiX,

      this.lineY

    );

    this.context.lineTo(

      this.roiX + this.roiWidth,

      this.lineY

    );

    this.context.stroke();

  }

  private drawCoordinates(): void {

    this.context.font = '18px Arial';

    this.context.fillStyle = '#00FF00';

    this.context.font = '22px Arial';

    this.context.fillText(

      `Total: ${this.countingService.getTotal()}`,

      20,

      60

    );

  }

  private drawROIInfo(): void {

    this.context.font = '15px Arial';

    this.context.fillStyle = '#FFFFFF';

    this.context.fillText(

      `ROI: (${Math.round(this.roiX)}, ${Math.round(this.roiY)}) ${Math.round(this.roiWidth)} x ${Math.round(this.roiHeight)}`,

      20,

      this.canvas.nativeElement.height - 20

    );

  }

  private drawDebug(): void {

    if (!this.showDebug) {
      return;
    }

    const lines = [

      `FPS: ${this.fps}`,

      `Processamento: ${this.processingTime} ms`,

      `Detecções: ${this.detections.length}`,

      `Contagem: ${this.countingService.getTotal()}`,

      `ROI: (${Math.round(this.roiX)}, ${Math.round(this.roiY)}) ${Math.round(this.roiWidth)}x${Math.round(this.roiHeight)}`,

      `Linha Y: ${Math.round(this.lineY)}`

    ];

    const x = 15;
    const y = 90;
    const lineHeight = 20;

    this.context.fillStyle = 'rgba(0,0,0,0.65)';
    this.context.fillRect(
      x - 10,
      y - 20,
      330,
      (lines.length * lineHeight) + 20
    );

    this.context.fillStyle = '#00FF00';
    this.context.font = '16px Consolas';

    lines.forEach((line, index) => {

      this.context.fillText(
        line,
        x,
        y + (index * lineHeight)
      );

    });

  }

}