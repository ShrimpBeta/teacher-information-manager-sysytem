import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { Monograph, MonographFilter } from '../../../models/models/monograph.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MonographService } from '../../../services/monograph.service';
import * as XLSX from 'xlsx';
import { UserExport } from '../../../models/models/user.model';

@Component({
  selector: 'app-exportmonograph',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportmonograph.component.html',
  styleUrl: './exportmonograph.component.scss'
})
export class ExportmonographComponent implements OnInit, OnDestroy, AfterViewInit {

  private destory$ = new Subject<boolean>();

  monographList: Monograph[] = [];
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'title', 'teachersIn', 'teachersOut', 'publishLevel', 'rank', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<Monograph>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Monograph>(true, []);

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

  exportSelectMonograph() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open("请选择要导出的专著", "关闭", {
        duration: 2000
      });
      return;
    }
    const monographExportList: MonographExport[] = [];
    this.selection.selected.forEach(monograph => {
      const monographExport = new MonographExport();
      monographExport.title = monograph.title;
      monographExport.teachersIn = monograph.teachersIn.map(teacher => teacher.username).join(',');
      monographExport.teachersOut = monograph.teachersOut.join(',');
      monographExport.publishLevel = monograph.publishLevel;
      monographExport.rank = monograph.rank;
      monographExport.publishDate = monograph.publishDate;
      monographExportList.push(monographExport);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(monographExportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Monograph.xlsx');
  }

  getTeacherInNames(teacherIn: UserExport[]): string {
    return teacherIn.map(teacher => teacher.username).join(',');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private monographService: MonographService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.monographService.getMonographsByFilter(new MonographFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.monographList = response.monographs;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource(this.monographList);
              this.dataSource.sort = this.sort;
            }
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open("获取数据失败", "关闭", {
              duration: 2000
            });
          }

        });
    });
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }
}

export class MonographExport {
  teachersIn: string = ""
  teachersOut: string = ""
  title: string = ""
  publishDate?: Date
  publishLevel: string = ""
  rank: string = ""
}
