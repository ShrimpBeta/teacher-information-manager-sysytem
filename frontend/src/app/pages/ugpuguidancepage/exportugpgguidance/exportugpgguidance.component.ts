import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { UGPGGuidance, UGPGGuidanceFilter } from '../../../models/models/uGPGGuidance.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-exportugpgguidance',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportugpgguidance.component.html',
  styleUrl: './exportugpgguidance.component.scss'
})
export class ExportugpgguidanceComponent implements OnInit, OnDestroy, AfterViewInit {

  private destory$ = new Subject<boolean>();

  uGPGGuidanceList: UGPGGuidance[] = [];
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'studentName', 'thesisTopic', 'defenseDate', 'defenseResult', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<UGPGGuidance>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<UGPGGuidance>(true, []);

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

  exportSelectUGPGGuidance() {
    if (this.selection.selected.length == 0) {
      this.snackBar.open("请选择导出的数据", "关闭", { duration: 3000 });
      return;
    }

    let uGPGGuidanceExports: UGPGGuidanceExport[] = this.selection.selected.map((uGPGGuidance) => {
      let uGPGGuidanceExport = new UGPGGuidanceExport();
      uGPGGuidanceExport.studentName = uGPGGuidance.studentName;
      uGPGGuidanceExport.thesisTopic = uGPGGuidance.thesisTopic;
      uGPGGuidanceExport.openingCheckDate = uGPGGuidance.openingCheckDate;
      uGPGGuidanceExport.openingCheckResult = uGPGGuidance.openingCheckResult;
      uGPGGuidanceExport.midtermCheckDate = uGPGGuidance.midtermCheckDate;
      uGPGGuidanceExport.midtermCheckResult = uGPGGuidance.midtermCheckResult;
      uGPGGuidanceExport.defenseDate = uGPGGuidance.defenseDate;
      uGPGGuidanceExport.defenseResult = uGPGGuidance.defenseResult;
      return uGPGGuidanceExport;
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(uGPGGuidanceExports);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'UGPGGuidance.xlsx');
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private uGPGGuidanceService: UGPGGuidanceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe((params) => {
      this.uGPGGuidanceService.getUGPGGuidancesByFilter(new UGPGGuidanceFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.uGPGGuidanceList = response.uGPGGuidances;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource<UGPGGuidance>(this.uGPGGuidanceList);
              this.dataSource.sort = this.sort;
            }
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open("获取数据失败", "关闭", { duration: 3000 });
          }

        });
    });
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }

  ngAfterViewInit(): void {
  }
}

export class UGPGGuidanceExport {
  studentName: string = ""
  thesisTopic: string = ""
  openingCheckDate?: Date
  openingCheckResult: string = ""
  midtermCheckDate?: Date
  midtermCheckResult: string = ""
  defenseDate?: Date
  defenseResult: string = ""
}
