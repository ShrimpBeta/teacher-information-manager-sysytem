import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { CompGuidance, CompGuidanceFilter } from '../../../models/models/compGuidance.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { CompGuidanceService } from '../../../services/compguidance.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exportcompguidance',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportcompguidance.component.html',
  styleUrl: './exportcompguidance.component.scss'
})
export class ExportcompguidanceComponent implements OnInit, OnDestroy, AfterViewInit {

  private destory$ = new Subject<boolean>();

  compGuidanceList: CompGuidance[] = [];
  totalCount = 0;
  displayedColumns: string[] = ['select', 'prjectName', 'awardStatus', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<CompGuidance>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<CompGuidance>(true, []);

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

    let selectedCompGuidances = this.selection.selected.map((compGuidanceTable) => {
      return this.compGuidanceList.find((compGuidance) => compGuidance.id === compGuidanceTable.id);
    });

    let compGuidanceExports: CompGuidanceExport[] = selectedCompGuidances
      .filter(compGuidance => compGuidance !== undefined)
      .map((compGuidance) => {
        let compGuidanceExport: CompGuidanceExport = {
          projectName: compGuidance!.projectName,
          studentNames: compGuidance!.studentNames.join(','),
          competitionScore: compGuidance!.competitionScore,
          guidanceDate: compGuidance!.guidanceDate,
          awardStatus: compGuidance!.awardStatus,
        };
        return compGuidanceExport;
      });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(compGuidanceExports);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CompGuidance.xlsx');


  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private compGuidanceService: CompGuidanceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.compGuidanceService.getCompGuidancesByFilter(new CompGuidanceFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.compGuidanceList = response.compGuidances;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource(this.compGuidanceList);
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

export class CompGuidanceExport {
  projectName: string = ""
  studentNames: string = ""
  competitionScore: string = ""
  guidanceDate?: Date
  awardStatus: string = ""
}
