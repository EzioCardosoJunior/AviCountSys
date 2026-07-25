import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { CameraListComponent } from './features/cameras/camera-list/camera-list';
import { CameraViewComponent } from './features/cameras/camera-view/camera-view';

export const routes: Routes = [

  {
    path: '',
    component: MainLayout,
    children: [

      {
        path: '',
        component: Dashboard
      },

      {
        path: 'cameras',
        component: CameraListComponent
      },

      {
        path: 'camera-view',
        component: CameraViewComponent
      }

    ]
  }

];