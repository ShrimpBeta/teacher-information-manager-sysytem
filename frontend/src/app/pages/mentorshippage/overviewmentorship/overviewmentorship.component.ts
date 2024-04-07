import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overviewmentorship',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule, DatePipe],
  templateUrl: './overviewmentorship.component.html',
  styleUrl: './overviewmentorship.component.scss'
})
export class OverviewmentorshipComponent implements OnInit, OnDestroy {
  constructor(

  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }
}
