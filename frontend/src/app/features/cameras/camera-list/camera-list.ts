import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

import { CameraService } from '../../../services/camera.service';
import { Camera } from '../../../models/camera';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [
    TableModule,
    CardModule
  ],
  templateUrl: './camera-list.html',
  styleUrl: './camera-list.scss'
})
export class CameraListComponent implements OnInit {

  cameras: Camera[] = [];

  constructor(
    private cameraService: CameraService
  ) {}

  ngOnInit(): void {
    this.cameraService.getAll().subscribe(data => {
      this.cameras = data;
    });
  }

}