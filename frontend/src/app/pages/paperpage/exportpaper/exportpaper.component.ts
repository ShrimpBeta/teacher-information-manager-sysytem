import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import { Paper, PaperFilter } from '../../../models/models/paper.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PaperService } from '../../../services/paper.service';
import { UserExport } from '../../../models/models/user.model';

@Component({
  selector: 'app-exportpaper',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportpaper.component.html',
  styleUrl: './exportpaper.component.scss'
})
export class ExportpaperComponent implements OnInit, OnDestroy, AfterViewInit {

  private destory$ = new Subject<boolean>();

  paperList: Paper[] = [];
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'title', 'teachersIn', 'teachersOut', 'journalName', 'rank', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<Paper>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Paper>(true, []);

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

  exportSelectPaper() {
    if (this.selection.selected.length === 0) {
      this.snackBar.open("请选择要导出的论文", "关闭", {
        duration: 2000
      });
      return;
    }
    const paperExportList: PaperExport[] = [];
    this.selection.selected.forEach(paper => {
      const paperExport = new PaperExport();
      paperExport.title = paper.title;
      paperExport.teachersIn = paper.teachersIn.map(teacher => teacher.username).join(',');
      paperExport.teachersOut = paper.teachersOut.join(',');
      paperExport.rank = paper.rank;
      paperExport.journalName = paper.journalName;
      paperExport.journalLevel = paper.journalLevel;
      paperExport.publishDate = paper.publishDate;
      paperExportList.push(paperExport);
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(paperExportList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Paper.xlsx');
  }

  getTeacherInNames(teacherIn: UserExport[]): string {
    return teacherIn.map(teacher => teacher.username).join(',');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private paperService: PaperService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.paperService.getPapersByFilter(new PaperFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: response => {
            if (response) {
              this.paperList = response.papers;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource(this.paperList);
              this.dataSource.sort = this.sort;
            }
          },
          error: err => {
            console.error(err);
            this.snackBar.open("获取论文列表失败", "关闭", {
              duration: 2000
            });
          }
        });
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }

}

export class PaperExport {
  teachersIn: string = ""
  teachersOut: string = ""
  title: string = ""
  publishDate?: Date
  rank: string = ""
  journalName: string = ""
  journalLevel: string = ""
}
