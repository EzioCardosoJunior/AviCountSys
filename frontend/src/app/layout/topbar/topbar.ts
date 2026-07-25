import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    ToolbarModule,
    TagModule
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {

}