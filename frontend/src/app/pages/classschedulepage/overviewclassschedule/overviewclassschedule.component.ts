import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CreateclassscheduledialogComponent } from '../../../components/createclassscheduledialog/createclassscheduledialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassSchedule, ClassScheduleFilter, EditClassSchedule, NewClassScheduleData } from '../../../models/models/classSchedule.model';
import { ClassScheduleService } from '../../../services/classschedule.service';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-overviewclassschedule',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, DatePipe, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatDividerModule, MatInputModule,
    MatFormFieldModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './overviewclassschedule.component.html',
  styleUrl: './overviewclassschedule.component.scss'
})
export class OverviewclassscheduleComponent implements OnInit, OnDestroy {

  SearchForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  private destory$ = new Subject<boolean>();

  classScheduleList: ClassSchedule[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  isSearching: boolean = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private classScheduleService: ClassScheduleService,
  ) { }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateclassscheduledialogComponent, {
      width: '450px',
      height: '395px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result !== '') {
          this.createClassSchedule(result)
        }
      }
    });
  }

  createClassSchedule(newClassScheduleData: NewClassScheduleData) {
    let newClassSchedule = new EditClassSchedule();

    newClassSchedule.termName = newClassScheduleData.termName;
    newClassSchedule.startDate = newClassScheduleData.startDate;
    newClassSchedule.weekCount = newClassScheduleData.weekCount;

    this.classScheduleService.createClassSchedule(newClassSchedule)
      .pipe(takeUntil(this.destory$)).subscribe({
        next: (result) => {
          if (result) {
            this.snackBar.open('创建课表成功', '关闭', {
              duration: 2000,
            });
            this.router.navigate(['/main/classschedule/edit', result.id]);
          } else {
            this.snackBar.open('创建课表失败', '关闭', {
              duration: 2000,
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('创建课表失败', '关闭', {
            duration: 2000,
          });
        }
      });
  }

  ngOnInit(): void {
    this.getClassScheduleList();
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }

  onSearch() {
    this.pageIndex = 0;
    this.getClassScheduleList();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getClassScheduleList();
  }

  getClassScheduleList() {
    let classScheduleFilter = new ClassScheduleFilter();
    if (this.SearchForm.get('name')?.value !== '') {
      classScheduleFilter.termName = this.SearchForm.get('name')?.value;
    }

    this.isSearching = true;

    this.classScheduleService.getClassSchedulesByFilter(classScheduleFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destory$)).subscribe({
        next: (result) => {
          if (result) {
            this.classScheduleList = result.academicTerms;
            this.totalCount = result.totalCount;
          } else {
            this.snackBar.open('获取数据失败', '关闭', {
              duration: 2000
            });
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('获取数据失败', '关闭', {
            duration: 2000
          });
          this.isSearching = false;
        }
      });
  }

  editClassSchedule(classSchedule: ClassSchedule) {
    this.router.navigate(['/main/classschedule/edit', classSchedule.id]);
  }

  deleteClassSchedule(classSchedule: ClassSchedule) {
    this.classScheduleService.deleteClassSchedule(classSchedule.id)
      .pipe(takeUntil(this.destory$)).subscribe({
        next: (result) => {
          if (result) {
            this.snackBar.open('删除课表成功', '关闭', {
              duration: 2000,
            });
            this.getClassScheduleList();
          } else {
            this.snackBar.open('删除课表失败', '关闭', {
              duration: 2000,
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('删除课表失败', '关闭', {
            duration: 2000,
          });
        }
      });
  }
}
