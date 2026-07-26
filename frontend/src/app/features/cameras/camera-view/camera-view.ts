import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CameraCanvasComponent } from '../../../shared/camera-canvas/camera-canvas';
@Component({
  selector: 'app-camera-view',
  standalone: true,
  templateUrl: './camera-view.html',
  styleUrl: './camera-view.scss',
  imports: [
        CameraCanvasComponent
    ]
})

export class CameraViewComponent implements AfterViewInit {

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  async ngAfterViewInit() {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: true,
          audio: false

        });

      this.video.nativeElement.srcObject = stream;

    } catch (e) {

      console.error(e);

    }

  }

}