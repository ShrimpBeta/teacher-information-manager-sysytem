import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { EduReform, EduReformFilter } from '../../../models/models/eduReform.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EduReformService } from '../../../services/edureform.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exportedureform',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportedureform.component.html',
  styleUrl: './exportedureform.component.scss'
})
export class ExportedureformComponent implements OnInit, OnDestroy, AfterViewInit {
  private destory$ = new Subject<boolean>();

  eduReformList: EduReform[] = [];
  eduReformsTable: EduReformTable[] = [];
  totalCount = 0;
  displayedColumns: string[] = ['select', 'title', 'teachersIn', 'teachersOut', 'number', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<EduReformTable>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<EduReformTable>(true, []);

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

  exportSeletedSchedule() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('请选择导出的数据', '关闭', { duration: 2000 });
      return;
    }

    let selectedEduReforms = this.selection.selected.map((eduReformTable) => {
      return this.eduReformList.find((eduReform) => eduReform.id === eduReformTable.id);
    });

    let eduReformExports: EduReformExport[] = selectedEduReforms
      .filter(eduReform => eduReform !== undefined)
      .map((eduReform) => {
        let eduReformExport: EduReformExport = {
          title: eduReform!.title,
          teachersIn: eduReform!.teachersIn.map((teacher) => teacher.username).join(','),
          teachersOut: eduReform!.teachersOut.join(','),
          number: eduReform!.number,
          startDate: eduReform!.startDate,
          duration: eduReform!.duration,
          level: eduReform!.level,
          rank: eduReform!.rank,
          achievement: eduReform!.achievement,
          fund: eduReform!.fund,
        };
        return eduReformExport;
      });

    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(eduReformExports);
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'eduReform.xlsx');
  }


  ngAfterViewInit(): void {

  }

  constructor(
    private snackBar: MatSnackBar,
    private eduReformService: EduReformService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe((params) => {
      this.eduReformService.getEduReformsByFilter(new EduReformFilter(), 0, Number(params['count'])).
        pipe(takeUntil(this.destory$)).subscribe({
          next: (eduReforms) => {
            if (eduReforms) {
              this.eduReformList = eduReforms.eduReforms;
              this.totalCount = eduReforms.totalCount;
              this.eduReformsTable = this.eduReformList.map((eduReform) => {
                return {
                  id: eduReform.id,
                  title: eduReform.title,
                  teachersIn: eduReform.teachersIn.map((teacher) => teacher.username).join(','),
                  teachersOut: eduReform.teachersOut.join(','),
                  number: eduReform.number,
                  achievement: eduReform.achievement,
                  createdAt: eduReform.createdAt,
                  updatedAt: eduReform.updatedAt,
                };
              });
              this.dataSource = new MatTableDataSource(this.eduReformsTable);
              this.dataSource.sort = this.sort;
            }
          },
          error: (error) => {
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

export interface EduReformTable {
  id: string;
  title: string;
  teachersIn: string;
  teachersOut: string;
  number: string;
  achievement: string
  createdAt: Date;
  updatedAt: Date;
}

export class EduReformExport {
  teachersIn: string = ""
  teachersOut: string = ""
  number: string = ""
  title: string = ""
  startDate?: Date
  duration: string = ""
  level: string = ""
  rank: string = ""
  achievement: string = ""
  fund: string = ""
}
