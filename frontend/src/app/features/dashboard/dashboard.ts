import { Component, OnInit } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';

import { Status } from '../cameras/models/status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

    status?: Status;

    constructor(
        private api: ApiService
    ) {}

    ngOnInit(): void {

        this.api.getStatus().subscribe({

            next: (response) => {

                this.status = response.data;

            },

            error: (err) => {

                console.error(err);

            }

        });

    }

}