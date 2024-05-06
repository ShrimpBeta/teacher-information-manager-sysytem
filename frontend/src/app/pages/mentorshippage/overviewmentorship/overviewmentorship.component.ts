import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Mentorship, MentorshipFilter } from '../../../models/models/mentorship.model';
import { MentorshipService } from '../../../services/mentorship.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewmentorship',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatTooltipModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewmentorship.component.html',
  styleUrl: './overviewmentorship.component.scss'
})
export class OverviewmentorshipComponent implements OnInit, OnDestroy {
  SearchForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  mentorshipList: Mentorship[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  displayedColumns: string[] = ['select', 'action', 'projectName', 'studentNames', 'grade', 'guidanceDate', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<Mentorship>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Mentorship>(true, []);

  isSearching: boolean = false;

  constructor(
    private mentorshipService: MentorshipService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  exportSelectMentorship() {
    if (this.selection.selected.length == 0) {
      this.snackBar.open("请选择导出的数据", "关闭", {
        duration: 2000,
      });
      return;
    }

    let mentorshipExports: MentorshipExport[] = [];
    this.selection.selected.forEach(mentorship => {
      let mentorshipExport = new MentorshipExport();
      mentorshipExport.projectName = mentorship.projectName;
      mentorshipExport.studentNames = mentorship.studentNames.join(",");
      mentorshipExport.grade = mentorship.grade;
      mentorshipExport.guidanceDate = mentorship.guidanceDate;
      mentorshipExports.push(mentorshipExport);
    });

    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mentorshipExports);
    XLSX.utils.book_append_sheet(wb, ws, "导出数据");
    XLSX.writeFile(wb, "Mentorship.xlsx");
  }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      projectName: new FormControl(''),
      studentNames: new FormArray([]),
      grade: new FormControl(''),
      guidanceDateStart: new FormControl(null),
      guidanceDateEnd: new FormControl(null),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
    });

    this.getMenotrshipList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSearch() {
    this.pageIndex = 0;
    // this.pageSize = 10;
    this.getMenotrshipList();
  }

  clearForm() {
    this.SearchForm.reset();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMenotrshipList();
  }

  editMentorship(mentorship: Mentorship) {
    this.router.navigate(['/main/mentorship/edit', mentorship.id]);
  }

  deleteMentorship(mentorship: Mentorship) {
    this.mentorshipService.deleteMentorship(mentorship.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        if (result) {
          this.snackBar.open('删除导师制项目成功', '关闭', { duration: 2000 });
          if (this.mentorshipList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getMenotrshipList();
        } else {
          this.snackBar.open('删除导师制项目失败', '关闭', { duration: 2000 });
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('删除导师制项目失败', '关闭', { duration: 2000 });
      }
    });
  }

  getMenotrshipList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    let mentorshipFilter = new MentorshipFilter();

    if (this.SearchForm.get('projectName')?.value !== '') {
      mentorshipFilter.projectName = this.SearchForm.get('projectName')?.value;
    }
    if (this.SearchForm.get('studentNames')?.value.length > 0) {
      mentorshipFilter.studentNames = this.SearchForm.get('studentNames')?.value;
    }
    if (this.SearchForm.get('grade')?.value !== '') {
      mentorshipFilter.grade = this.SearchForm.get('grade')?.value;
    }

    mentorshipFilter.guidanceDateStart = this.SearchForm.get('guidanceDateStart')?.value;
    mentorshipFilter.guidanceDateEnd = this.SearchForm.get('guidanceDateEnd')?.value;
    mentorshipFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    mentorshipFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    mentorshipFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    mentorshipFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    this.isSearching = true;
    console.log(mentorshipFilter);

    this.mentorshipService.getMentorshipsByFilter(mentorshipFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (mentorshipPage) => {
          if (mentorshipPage) {
            this.mentorshipList = mentorshipPage.mentorships;
            this.totalCount = mentorshipPage.totalCount;
            this.dataSource = new MatTableDataSource(this.mentorshipList);
            this.dataSource.sort = this.sort;
          } else {
            this.snackBar.open('获取导师制项目失败', '关闭', { duration: 2000 });
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('获取导师制项目失败', '关闭', { duration: 2000 });
          this.isSearching = false;
        }
      });
  }

  get studentNames() {
    return this.SearchForm.get('studentNames') as FormArray;
  }

  addStudentName(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      let index = this.studentNames.controls.findIndex((control) => control.value === value);
      if (index === -1) {
        this.studentNames.push(new FormControl(value));
      }
    }
    event.chipInput!.clear();
  }

  removeStudentName(index: number) {
    this.studentNames.removeAt(index);
  }

  editStudentName(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      let index = this.studentNames.controls.findIndex((control) => control.value === value);
      if (index === -1) {
        this.studentNames.at(index).setValue(value);
      }
    } else {
      this.studentNames.removeAt(index);
    }
  }

}


export class MentorshipExport {
  projectName: string = ""
  studentNames: string = ""
  grade: string = ""
  guidanceDate?: Date
}
