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
import { Subject, takeUntil } from 'rxjs';
import { CompGuidance, CompGuidanceFilter } from '../../../models/models/compGuidance.model';
import { CompGuidanceService } from '../../../services/compguidance.service';

@Component({
  selector: 'app-overviewcompguidance',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule],
  templateUrl: './overviewcompguidance.component.html',
  styleUrl: './overviewcompguidance.component.scss'
})
export class OverviewcompguidanceComponent {
  SearchForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  compGuidanceList: CompGuidance[] = [];
  constructor(
    private compGuidanceService: CompGuidanceService,
  ) { }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      projectName: new FormControl(''),
      studentNames: new FormArray([]),
      guidanceDateStart: new FormControl(''),
      guidanceDateEnd: new FormControl(''),
      awardStatus: new FormControl(''),
      createdStart: new FormControl(''),
      createdEnd: new FormControl(''),
      updatedStart: new FormControl(''),
      updatedEnd: new FormControl(''),
    });

    // this.getCompGuidanceList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getCompGuidanceList() {
    let compGuidanceFilter = new CompGuidanceFilter();
    if (this.SearchForm.get('projectName')?.value !== '') {
      compGuidanceFilter.projectName = this.SearchForm.get('projectName')?.value;
    }
    if (this.SearchForm.get('studentNames')?.value.length > 0) {
      compGuidanceFilter.studentNames = this.SearchForm.get('studentNames')?.value;
    }
    if (this.SearchForm.get('guidanceDateStart')?.value !== '') {
      compGuidanceFilter.guidanceDateStart = this.SearchForm.get('guidanceDateStart')?.value;
    }
    if (this.SearchForm.get('guidanceDateEnd')?.value !== '') {
      compGuidanceFilter.guidanceDateEnd = this.SearchForm.get('guidanceDateEnd')?.value;
    }
    if (this.SearchForm.get('awardStatus')?.value !== '') {
      compGuidanceFilter.awardStatus = this.SearchForm.get('awardStatus')?.value;
    }
    if (this.SearchForm.get('createdStart')?.value !== '') {
      compGuidanceFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    }
    if (this.SearchForm.get('createdEnd')?.value !== '') {
      compGuidanceFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    }
    if (this.SearchForm.get('updatedStart')?.value !== '') {
      compGuidanceFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    }
    if (this.SearchForm.get('updatedEnd')?.value !== '') {
      compGuidanceFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;
    }

    this.compGuidanceService.getCompGuidancesByFilter(compGuidanceFilter).pipe(takeUntil(this.destroy$)).subscribe({
      next: (compGuidances) => {
        if (compGuidances !== null) {
          this.compGuidanceList = compGuidances;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
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
    this.getCompGuidanceList();
  }

  clearForm() {
    this.SearchForm.reset();
  }

}
