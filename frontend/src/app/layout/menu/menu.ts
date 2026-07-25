import { Component } from '@angular/core';

import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    PanelMenuModule
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {

    items: MenuItem[] = [

        {
            label: 'Dashboard',
            icon: 'pi pi-home'
        },

        {
            label: 'Câmeras',
            icon: 'pi pi-video'
        },

        {
            label: 'Contador',
            icon: 'pi pi-chart-bar'
        },

        {
            label: 'Relatórios',
            icon: 'pi pi-file'
        },

        {
            label: 'Configurações',
            icon: 'pi pi-cog'
        }

    ];

}