import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CompGuidance, CompGuidanceFilter } from '../../../models/models/compGuidance.model';
import { CompGuidanceService } from '../../../services/compguidance.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewcompguidance',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatTooltipModule, MatPaginatorModule,
    MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewcompguidance.component.html',
  styleUrl: './overviewcompguidance.component.scss'
})
export class OverviewcompguidanceComponent implements OnInit, OnDestroy, AfterViewInit {
  SearchForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  compGuidanceList: CompGuidance[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  displayedColumns: string[] = ['select', 'action', 'projectName', 'studentNames', 'competitionScore', 'guidanceDate', 'awardStatus', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<CompGuidance>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<CompGuidance>(true, []);

  isSearching: boolean = false;

  constructor(
    private compGuidanceService: CompGuidanceService,
    private snackBar: MatSnackBar,
    private router: Router,
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

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      projectName: new FormControl(''),
      studentNames: new FormArray([]),
      guidanceDateStart: new FormControl(null),
      guidanceDateEnd: new FormControl(null),
      awardStatus: new FormControl(''),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
    });

    this.getCompGuidanceList();
  }

  ngAfterViewInit(): void {
    // this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  onSearch() {
    this.pageIndex = 0;
    // this.pageSize = 10;
    this.getCompGuidanceList();
  }

  clearForm() {
    this.SearchForm = new FormGroup({
      projectName: new FormControl(''),
      studentNames: new FormArray([]),
      guidanceDateStart: new FormControl(null),
      guidanceDateEnd: new FormControl(null),
      awardStatus: new FormControl(''),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getCompGuidanceList();
  }

  editCompGuidance(compGuidance: CompGuidance) {
    this.router.navigate(['/main/competitionguidance/edit', compGuidance.id]);
  }

  deleteCompGuidance(compGuidance: CompGuidance) {
    this.compGuidanceService.deleteCompGuidance(compGuidance.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        if (result) {
          this.snackBar.open('删除竞赛记录成功', '关闭', { duration: 2000 });
          if (this.compGuidanceList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getCompGuidanceList();
        } else {
          this.snackBar.open('删除竞赛记录失败', '关闭', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('删除竞赛记录失败', '关闭', { duration: 2000 });
      }
    });
  }

  getCompGuidanceList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    let compGuidanceFilter = new CompGuidanceFilter();
    if (this.SearchForm.get('projectName')?.value !== '') {
      compGuidanceFilter.projectName = this.SearchForm.get('projectName')?.value;
    }
    if (this.SearchForm.get('studentNames')?.value.length > 0) {
      compGuidanceFilter.studentNames = this.SearchForm.get('studentNames')?.value;
    }

    if (this.SearchForm.get('awardStatus')?.value !== '') {
      compGuidanceFilter.awardStatus = this.SearchForm.get('awardStatus')?.value;
    }

    compGuidanceFilter.guidanceDateStart = this.SearchForm.get('guidanceDateStart')?.value;
    compGuidanceFilter.guidanceDateEnd = this.SearchForm.get('guidanceDateEnd')?.value;
    compGuidanceFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    compGuidanceFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    compGuidanceFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    compGuidanceFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    this.isSearching = true;
    console.log(compGuidanceFilter);
    this.compGuidanceService.getCompGuidancesByFilter(compGuidanceFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (compGuidancesPage) => {
          if (compGuidancesPage) {
            this.compGuidanceList = compGuidancesPage.compGuidances;
            this.totalCount = compGuidancesPage.totalCount;
            this.dataSource = new MatTableDataSource(this.compGuidanceList);
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
      let existIndex = this.studentNames.controls.findIndex((control, i) => i !== index && control.value === value);
      if (existIndex === -1) {
        this.studentNames.at(index).setValue(value);
      }
    } else {
      this.studentNames.removeAt(index);
    }
  }
}

export class CompGuidanceExport {
  projectName: string = ""
  studentNames: string = ""
  competitionScore: string = ""
  guidanceDate?: Date
  awardStatus: string = ""
}
