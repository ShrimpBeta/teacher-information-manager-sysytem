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
import { UGPGGuidance, UGPGGuidanceFilter } from '../../../models/models/uGPGGuidance.model';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-overviewugpgguidance',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatTooltipModule, MatPaginatorModule,
    MatProgressSpinnerModule],
  templateUrl: './overviewugpgguidance.component.html',
  styleUrl: './overviewugpgguidance.component.scss'
})
export class OverviewugpgguidanceComponent {
  SearchForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  uGPGGuidanceList: UGPGGuidance[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  isSearching: boolean = false;

  constructor(
    private uGPGGuidanceService: UGPGGuidanceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      thesisTopic: new FormControl(''),
      studentName: new FormControl(''),
      defenseDateStart: new FormControl(null),
      defenseDateEnd: new FormControl(null),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  onSearch() {
    this.pageIndex = 0;
    // this.pageSize = 10;
    this.getUGPGGuidanceList();
  }

  clearForm() {
    this.SearchForm.reset();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getUGPGGuidanceList();
  }

  deleteUPGPGuidance(uGPGGuidance: UGPGGuidance) {
    this.uGPGGuidanceService.deleteUGPGGuidance(uGPGGuidance.id)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
          if (result) {
            this.snackBar.open('删除成功', '关闭', { duration: 2000 });
            this.getUGPGGuidanceList();
          } else {
            this.snackBar.open('删除失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('删除失败', '关闭', { duration: 2000 });
        }
      });
  }

  getUGPGGuidanceList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    let uGPGGuidanceFilter = new UGPGGuidanceFilter();
    if (this.SearchForm.get('thesisTopic')?.value) {
      uGPGGuidanceFilter.thesisTopic = this.SearchForm.get('thesisTopic')?.value;
    }
    if (this.SearchForm.get('studentName')?.value) {
      uGPGGuidanceFilter.studentName = this.SearchForm.get('studentName')?.value;
    }
  }

}

