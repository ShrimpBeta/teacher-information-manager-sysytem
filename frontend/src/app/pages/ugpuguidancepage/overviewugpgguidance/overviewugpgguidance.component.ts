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
import { Subject, takeUntil } from 'rxjs';
import { UGPGGuidance, UGPGGuidanceFilter } from '../../../models/models/uGPGGuidance.model';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewugpgguidance',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatTooltipModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
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
  pageSizeOptions: number[] = [10, 25, 50, 100];

  displayedColumns: string[] = ['select', 'action', 'studentName', 'thesisTopic', 'openingCheckDate', 'openingCheckResult', 'midtermCheckDate', 'midtermCheckResult', 'defenseDate', 'defenseResult', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<UGPGGuidance>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<UGPGGuidance>(true, []);

  isSearching: boolean = false;

  constructor(
    private uGPGGuidanceService: UGPGGuidanceService,
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

    this.getUGPGGuidanceList();
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

  editUGPGGuidance(uGPGGuidance: UGPGGuidance) {
    this.router.navigate(['/main/ugpgguidance/edit', uGPGGuidance.id]);
  }

  deleteUGPGGuidance(uGPGGuidance: UGPGGuidance) {
    this.uGPGGuidanceService.deleteUGPGGuidance(uGPGGuidance.id)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
          if (result) {
            this.snackBar.open('删除成功', '关闭', { duration: 2000 });
            if (this.uGPGGuidanceList.length === 1 && this.pageIndex > 0) {
              this.pageIndex--;
            }
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

    uGPGGuidanceFilter.defenseDateStart = this.SearchForm.get('defenseDateStart')?.value;
    uGPGGuidanceFilter.defenseDateEnd = this.SearchForm.get('defenseDateEnd')?.value;
    uGPGGuidanceFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    uGPGGuidanceFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    uGPGGuidanceFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    uGPGGuidanceFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    console.log(uGPGGuidanceFilter);
    this.isSearching = true;

    this.uGPGGuidanceService.getUGPGGuidancesByFilter(uGPGGuidanceFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (uGPGGuidancePage) => {
          if (uGPGGuidancePage) {
            this.uGPGGuidanceList = uGPGGuidancePage.uGPGGuidances;
            this.totalCount = uGPGGuidancePage.totalCount;
            this.dataSource = new MatTableDataSource<UGPGGuidance>(this.uGPGGuidanceList);
            this.dataSource.sort = this.sort;
          } else {
            this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          }
          this.isSearching = false;
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          this.isSearching = false;
        }
      });
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
