import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { SciResearch, SciResearchFilter } from '../../../models/models/sciResearch.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SciResearchService } from '../../../services/sciresearch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewsciresearch',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatAutocompleteModule, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewsciresearch.component.html',
  styleUrl: './overviewsciresearch.component.scss'
})
export class OverviewsciresearchComponent implements OnInit, OnDestroy {
  SearchForm!: FormGroup;
  isawardCtrl = new FormControl('none');
  awareForm!: FormGroup;
  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  teachersInOptions: UserExport[] = [];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  $destroy: Subject<boolean> = new Subject<boolean>();

  sciResearchList: SciResearch[] = [];
  sciResearchTableList: SciResearchTable[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  displayedColumns: string[] = ['select', 'action', 'title', 'teachersIn', 'teachersOut', 'number', 'startDate', 'duration', 'level', 'rank', 'achievement', 'fund', 'isAward', 'awardName', 'awardLevel', 'awardRank', 'awardDate', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<SciResearchTable>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<SciResearchTable>(true, []);

  isSearching: boolean = false;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private sciResearchService: SciResearchService,
    private router: Router
  ) {

  }

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

    let selectedSciResearchs = this.selection.selected.map((sciResearchTable) => {
      return this.sciResearchList.find((sciResearch) => sciResearch.id === sciResearchTable.id);
    });

    let sciResearchExports: SciResearchExport[] = selectedSciResearchs
      .filter(sciResearch => sciResearch !== undefined)
      .map((sciResearch) => {
        let sciResearchExport: SciResearchExport = {
          title: sciResearch!.title,
          teachersIn: sciResearch!.teachersIn.map((teacher) => teacher.username).join(','),
          teachersOut: sciResearch!.teachersOut.join(','),
          number: sciResearch!.number,
          startDate: sciResearch!.startDate,
          duration: sciResearch!.duration,
          level: sciResearch!.level,
          rank: sciResearch!.rank,
          achievement: sciResearch!.achievement,
          fund: sciResearch!.fund,
          awardName: sciResearch!.isAward ? sciResearch!.awards[0].awardName : '',
          awardLevel: sciResearch!.isAward ? sciResearch!.awards[0].awardLevel || '' : '',
          awardRank: sciResearch!.isAward ? sciResearch!.awards[0].awardRank || '' : '',
          awardDate: sciResearch!.isAward ? sciResearch!.awards[0].awardDate : null
        };
        return sciResearchExport;
      });

    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sciResearchExports);
    let workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'sciResearch.xlsx');
  }

  getTeacherInNames(teacherIn: UserExport[]): string {
    return teacherIn.map(teacher => teacher.username).join(',');
  }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      title: new FormControl(''),
      number: new FormControl(''),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      level: new FormControl(''),
      rank: new FormControl(''),
      achievement: new FormControl(''),
      fund: new FormControl(''),
      startDateStart: new FormControl(null),
      startDateEnd: new FormControl(null),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
      awardName: new FormControl(''),
      awardlevel: new FormControl(''),
      awardRank: new FormControl(''),
      awardDateStart: new FormControl(null),
      awardDateEnd: new FormControl(null),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (response) => {
        console.log(response);
        this.teachersInOptions = response;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.getSciResearchList();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


  onSearch() {
    this.pageIndex = 0;
    this.getSciResearchList();
  }

  clearForm() {
    this.SearchForm = new FormGroup({
      title: new FormControl(''),
      number: new FormControl(''),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      level: new FormControl(''),
      rank: new FormControl(''),
      achievement: new FormControl(''),
      fund: new FormControl(''),
      startDateStart: new FormControl(null),
      startDateEnd: new FormControl(null),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
      awardName: new FormControl(''),
      awardlevel: new FormControl(''),
      awardRank: new FormControl(''),
      awardDateStart: new FormControl(null),
      awardDateEnd: new FormControl(null),
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getSciResearchList();
  }

  getSciResearchList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    let sciResearchFilter = new SciResearchFilter();
    if (this.SearchForm.get('title')?.value !== '') {
      sciResearchFilter.title = this.SearchForm.get('title')?.value;
    }
    if (this.SearchForm.get('number')?.value !== '') {
      sciResearchFilter.number = this.SearchForm.get('number')?.value;
    }
    if (this.SearchForm.get('teachersOut')?.value.length > 0) {
      sciResearchFilter.teachersOut = this.SearchForm.get('teachersOut')?.value;
    }
    if (this.SearchForm.get('level')?.value !== '') {
      sciResearchFilter.level = this.SearchForm.get('level')?.value;
    }
    if (this.SearchForm.get('rank')?.value !== '') {
      sciResearchFilter.rank = this.SearchForm.get('rank')?.value;
    }
    if (this.SearchForm.get('achievement')?.value !== '') {
      sciResearchFilter.achievement = this.SearchForm.get('achievement')?.value;
    }
    if (this.SearchForm.get('fund')?.value !== '') {
      sciResearchFilter.fund = this.SearchForm.get('fund')?.value;
    }

    sciResearchFilter.startDateStart = this.SearchForm.get('startDateStart')?.value;
    sciResearchFilter.startDateEnd = this.SearchForm.get('startDateEnd')?.value;
    sciResearchFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    sciResearchFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    sciResearchFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    sciResearchFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    let teachersInControlArray = this.SearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      sciResearchFilter.teachersIn = teachersInControlArray.controls.map((control: AbstractControl) => {
        return control.value.id;
      });
    }

    if (this.isawardCtrl.value === 'true') {
      sciResearchFilter.isAward = true;
      if (this.SearchForm.get('awardName')?.value !== '') {
        sciResearchFilter.awardName = this.SearchForm.get('awardName')?.value;
      }
      if (this.SearchForm.get('awardlevel')?.value !== '') {
        sciResearchFilter.awardLevel = this.SearchForm.get('awardlevel')?.value;
      }
      if (this.SearchForm.get('awardRank')?.value !== '') {
        sciResearchFilter.rank = this.SearchForm.get('awardRank')?.value;
      }
      sciResearchFilter.awardDateStart = this.SearchForm.get('awardDateStart')?.value;
      sciResearchFilter.awardDateEnd = this.SearchForm.get('awardDateEnd')?.value;

    } else if (this.isawardCtrl.value === 'false') {
      sciResearchFilter.isAward = false;
    }

    console.log(sciResearchFilter);
    this.isSearching = true;

    this.sciResearchService.getSciResearchsByFilter(sciResearchFilter, this.pageIndex, this.pageSize).pipe(takeUntil(this.$destroy)).subscribe({
      next: (sciResearchPage) => {
        if (sciResearchPage) {
          this.sciResearchList = sciResearchPage.sciResearchs;
          this.totalCount = sciResearchPage.totalCount;
          this.sciResearchTableList = this.sciResearchList.map((sciResearch) => {
            let sciResearchTable: SciResearchTable = {
              id: sciResearch.id,
              title: sciResearch.title,
              teachersIn: sciResearch.teachersIn,
              teachersOut: sciResearch.teachersOut,
              number: sciResearch.number,
              startDate: sciResearch.startDate,
              duration: sciResearch.duration,
              level: sciResearch.level,
              rank: sciResearch.rank,
              achievement: sciResearch.achievement,
              fund: sciResearch.fund,
              isAward: sciResearch.isAward,
              awardName: sciResearch.isAward ? sciResearch.awards[0].awardName : '',
              awardLevel: sciResearch.isAward ? sciResearch.awards[0].awardLevel || '' : '',
              awardRank: sciResearch.isAward ? sciResearch.awards[0].awardRank || '' : '',
              awardDate: sciResearch.isAward ? sciResearch.awards[0].awardDate || undefined : undefined,
              createdAt: sciResearch.createdAt,
              updatedAt: sciResearch.updatedAt
            };
            return sciResearchTable;
          });
          this.dataSource = new MatTableDataSource(this.sciResearchTableList);
          this.dataSource.sort = this.sort;
        } else {
          this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
        this.isSearching = false;
      }
    });

  }

  editSciResearch(sciResearch: SciResearch) {
    this.router.navigate(['/main/scientificresearch/edit', sciResearch.id]);
  }

  deleteSciResearch(sciResearch: SciResearch) {
    this.sciResearchService.deleteSciResearch(sciResearch.id)
      .pipe(takeUntil(this.$destroy)).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open('删除成功', '关闭', { duration: 2000 });
            this.getSciResearchList();
          } else {
            this.snackBar.open('删除失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('删除失败', '关闭', { duration: 2000 });
        }
      });
  }

  get teachersIn() {
    return this.SearchForm.get('teachersIn') as FormArray;
  }

  get teachersOut() {
    return this.SearchForm.get('teachersOut') as FormArray;
  }

  teachersInSelected(event: MatAutocompleteSelectedEvent) {
    let selectedTeacherIn: UserExport = event.option.value;
    let index = this.teachersIn.controls.findIndex((control: AbstractControl) => {
      return control.value.id === selectedTeacherIn.id;
    });
    if (index === -1) {
      this.teachersIn.push(new FormControl(selectedTeacherIn));
    }
    this.teachersInInput.nativeElement.value = '';
    this.teachersInCtrl.setValue(null);
  }

  addTeachersIn(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      let index = this.teachersInOptions.findIndex((teacher) => teacher.username === value);
      if (index !== -1) {
        let existIndex = this.teachersIn.controls.findIndex((control: AbstractControl) => {
          return control.value.id === this.teachersInOptions[index].id;
        });
        if (existIndex === -1) {
          this.teachersIn.push(new FormControl(this.teachersInOptions[index]));
        }
      }
    }
    event.chipInput!.clear();
    this.teachersInCtrl.setValue(null);
  }

  addTeachersOut(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      let index = this.teachersOut.controls.findIndex((control: AbstractControl) => {
        return control.value === value;
      });
      if (index === -1) {
        this.teachersOut.push(new FormControl(value));
      }
    }
    event.chipInput!.clear();
  }

  removeTeachersIn(index: number) {
    this.teachersIn.removeAt(index);
  }

  removeTeachersOut(index: number) {
    this.teachersOut.removeAt(index);
  }

  editTeachersIn(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      let opntionIndex = this.teachersInOptions.findIndex((teacher) => teacher.username === value);
      if (opntionIndex !== -1) {
        let existIndex = this.teachersIn.controls.findIndex((control: AbstractControl) => {
          return control.value.id === this.teachersInOptions[opntionIndex].id;
        });
        if (existIndex === -1) {
          this.teachersIn.at(index).setValue(value);
        }
      }
    } else {
      this.teachersIn.removeAt(index);
    }
  }

  editTeachersOut(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      let existIndex = this.teachersOut.controls.findIndex((control: AbstractControl) => {
        return control.value === value;
      });
      if (existIndex === -1) {
        this.teachersOut.at(index).setValue(value);
      }
    } else {
      this.teachersOut.removeAt(index);
    }
  }

}

export interface SciResearchTable {
  id: string
  teachersIn: UserExport[]
  teachersOut: string[]
  number: string
  title: string
  startDate: Date | undefined
  duration: string
  level: string
  rank: string
  achievement: string
  fund: string
  isAward: boolean
  awardName: string
  awardLevel: string
  awardRank: string
  awardDate: Date | undefined
  createdAt: Date
  updatedAt: Date
}

export class SciResearchExport {
  teachersIn: string = ""
  teachersOut: string = ""
  number: string = ""
  title: string = ""
  startDate?: Date | null
  duration: string = ""
  level: string = ""
  rank: string = ""
  achievement: string = ""
  fund: string = ""
  awardName: string = ""
  awardLevel: string = ""
  awardRank: string = ""
  awardDate?: Date | null
}
