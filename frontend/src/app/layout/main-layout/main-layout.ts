import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Menu } from '../menu/menu';
import { Topbar } from '../topbar/topbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Menu,
    Topbar,
    Footer
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {

}