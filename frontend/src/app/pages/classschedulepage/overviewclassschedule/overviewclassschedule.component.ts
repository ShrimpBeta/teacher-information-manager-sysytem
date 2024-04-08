import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overviewclassschedule',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, DatePipe],
  templateUrl: './overviewclassschedule.component.html',
  styleUrl: './overviewclassschedule.component.scss'
})
export class OverviewclassscheduleComponent {

}
