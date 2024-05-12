import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CreateclassscheduledialogComponent } from '../../../components/createclassscheduledialog/createclassscheduledialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClassSchedule, ClassScheduleFilter, ClassTime, EditClassSchedule, NewClassScheduleData } from '../../../models/models/classSchedule.model';
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
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-overviewclassschedule',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, DatePipe, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatDividerModule, MatInputModule,
    MatFormFieldModule, ReactiveFormsModule, MatCardModule, MatCheckboxModule, MatTableModule, MatSortModule],
  templateUrl: './overviewclassschedule.component.html',
  styleUrl: './overviewclassschedule.component.scss'
})
export class OverviewclassscheduleComponent implements OnInit, OnDestroy, AfterViewInit {

  SearchForm: FormGroup = new FormGroup({
    name: new FormControl(''),
  });

  private destory$ = new Subject<boolean>();

  classScheduleList: ClassSchedule[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  classSchedulesTable: ClassScheduleTable[] = [];
  // displayedColumns: string[] = ['select', 'action', 'termName', 'startDate', 'weekCount', 'createdAt', 'updatedAt'];
  displayedColumns: string[] = ['action', 'termName', 'startDate', 'weekCount', 'createdAt', 'updatedAt'];


  dataSource!: MatTableDataSource<ClassScheduleTable>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<ClassScheduleTable>(true, []);

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

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  // exportSelectedSchedules() {
  //   const ids = this.selection.selected.map((schedule) => schedule.id);

  //   if (ids.length === 0) {
  //     this.snackBar.open('请选择导出的数据', '关闭', { duration: 2000 });
  //     return;
  //   }

  //   this.classScheduleService.getClassSchedules(ids).pipe(takeUntil(this.destory$)).subscribe({
  //     next: (schedules) => {
  //       if (schedules) {
  //         console.log(schedules);
  //         const schedulesJson = JSON.stringify(schedules);
  //         const blob = new Blob([schedulesJson], { type: 'application/json' });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = 'classSchedules.json';
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         window.URL.revokeObjectURL(url);
  //       }
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
  //     }
  //   });
  // }

  ngOnInit(): void {
    this.getClassScheduleList();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
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
        next: (classSchedulePage) => {
          if (classSchedulePage) {
            this.classScheduleList = classSchedulePage.academicTerms;
            this.totalCount = classSchedulePage.totalCount;
            let tempTable: ClassScheduleTable[] = [];
            for (let i = 0; i < this.classScheduleList.length; i++) {
              let classScheduleTable: ClassScheduleTable = {
                id: this.classScheduleList[i].id,
                termName: this.classScheduleList[i].termName,
                startDate: this.classScheduleList[i].startDate,
                weekCount: this.classScheduleList[i].weekCount,
                createdAt: this.classScheduleList[i].createdAt,
                updatedAt: this.classScheduleList[i].updatedAt
              };
              tempTable.push(classScheduleTable);
            }
            this.classSchedulesTable = tempTable;
            this.dataSource = new MatTableDataSource<ClassScheduleTable>(this.classSchedulesTable);
            this.dataSource.sort = this.sort;
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

  editClassSchedule(classSchedule: ClassScheduleTable) {
    this.router.navigate(['/main/classschedule/edit', classSchedule.id]);
  }

  deleteClassSchedule(classSchedule: ClassScheduleTable) {
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

export interface ClassScheduleTable {
  id: string;
  termName: string;
  startDate: Date;
  weekCount: number;
  createdAt: Date;
  updatedAt: Date;
}
