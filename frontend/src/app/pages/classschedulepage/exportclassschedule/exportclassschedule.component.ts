import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassScheduleService } from '../../../services/classschedule.service';
import { ClassSchedule, ClassScheduleFilter, Course } from '../../../models/models/classSchedule.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exportclassschedule',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportclassschedule.component.html',
  styleUrl: './exportclassschedule.component.scss'
})
export class ExportclassscheduleComponent implements OnInit, OnDestroy, AfterViewInit {

  private destory$ = new Subject<boolean>();

  classScheduleList: ClassSchedule[] = [];
  classSchedulesTable: ClassScheduleTable[] = [];
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'termName', 'startDate', 'weekCount', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<ClassScheduleTable>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<ClassScheduleTable>(true, []);

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

  exportSelectedSchedules() {
    const ids = this.selection.selected.map((schedule) => schedule.id);

    if (ids.length === 0) {
      this.snackBar.open('请选择导出的数据', '关闭', { duration: 2000 });
      return;
    }

    this.classScheduleService.getClassSchedules(ids).pipe(takeUntil(this.destory$)).subscribe({
      next: (schedules) => {
        if (schedules) {
          console.log(schedules);
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
      }
    });

  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;s
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private classScheduleService: ClassScheduleService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.classScheduleService.getClassSchedulesByFilter(new ClassScheduleFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.classScheduleList = response.academicTerms;
              this.totalCount = response.totalCount;
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
            }
          },
          error: (error) => {
            console.log(error);
            this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
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
