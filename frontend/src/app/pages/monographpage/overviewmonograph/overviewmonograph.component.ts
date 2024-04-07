import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-overviewmonograph',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule],
  templateUrl: './overviewmonograph.component.html',
  styleUrl: './overviewmonograph.component.scss'
})
export class OverviewmonographComponent {
  SearchForm!: FormGroup;
  constructor(

  ) { }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      projectName: new FormControl(''),
      studentNames: new FormArray([]),
      grade: new FormControl(''),
      guidanceDateStart: new FormControl(''),
      guidanceDateEnd: new FormControl(''),
      createdStart: new FormControl(''),
      createdEnd: new FormControl(''),
      updatedStart: new FormControl(''),
      updatedEnd: new FormControl(''),
    });
  }

  ngOnDestroy(): void {

  }


  get studentNames() {
    return this.SearchForm.get('studentNames') as FormArray;
  }

  addStudentName(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      this.studentNames.push(new FormControl(value));
    }
    event.chipInput!.clear();
  }

  removeStudentName(index: number) {
    this.studentNames.removeAt(index);
  }

  editStudentName(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      this.studentNames.at(index).setValue(value);
    } else {
      this.studentNames.removeAt(index);
    }
  }

  onSearch() {
    console.log(this.SearchForm.value);
  }

  clearForm() {
    this.SearchForm.reset();
  }
}
