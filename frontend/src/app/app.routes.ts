import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard';
import { CameraListComponent } from './features/cameras/camera-list/camera-list';

import { MainLayout } from './layout/main-layout/main-layout';


export const routes: Routes = [

    {
        path: '',
        component: MainLayout,
        children: [

            {
                path: '',
                loadComponent: () =>
                    import('./features/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },
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
                loadComponent: () =>
                    import('./features/cameras/camera-view/camera-view')
                        .then(m => m.CameraViewComponent)
            }

        ]
    }

];