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
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router, RouterLink } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { UserExport } from '../../../models/models/user.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EduReform, EduReformFilter } from '../../../models/models/eduReform.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EduReformService } from '../../../services/edureform.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewedureform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatAutocompleteModule, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewedureform.component.html',
  styleUrl: './overviewedureform.component.scss'
})
export class OverviewedureformComponent implements OnInit, OnDestroy {
  SearchForm!: FormGroup;
  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  teachersInOptions: UserExport[] = [];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  $destroy: Subject<boolean> = new Subject<boolean>();

  eduReformList: EduReform[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  displayedColumns: string[] = ['select', 'action', 'title', 'teachersIn', 'teachersOut', 'number', 'startDate', 'duration', 'level', 'rank', 'achievement', 'fund', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<EduReform>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<EduReform>(true, []);

  isSearching: boolean = false;

  constructor(
    private userService: UserService,
    private eduReformService: EduReformService,
    private router: Router,
    private snackBar: MatSnackBar
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
    XLSX.writeFile(workbook, 'EduReform.xlsx');
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

    this.getEduReformList();
  }

  getTeacherInNames(teacherIn: UserExport[]): string {
    return teacherIn.map(teacher => teacher.username).join(',');
  }


  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


  onSearch() {
    this.pageIndex = 0;
    // this.pageSize = 10;
    this.getEduReformList();
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
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getEduReformList();
  }

  getEduReformList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    let eduReformFilter = new EduReformFilter();
    if (this.SearchForm.get('title')?.value !== '') {
      eduReformFilter.title = this.SearchForm.get('title')?.value;
    }
    if (this.SearchForm.get('teachersOut')?.value.length > 0) {
      eduReformFilter.teachersOut = this.SearchForm.get('teachersOut')?.value;
    }
    if (this.SearchForm.get('number')?.value !== '') {
      eduReformFilter.number = this.SearchForm.get('number')?.value;
    }
    if (this.SearchForm.get('level')?.value !== '') {
      eduReformFilter.level = this.SearchForm.get('level')?.value;
    }
    if (this.SearchForm.get('rank')?.value !== '') {
      eduReformFilter.rank = this.SearchForm.get('rank')?.value;
    }
    if (this.SearchForm.get('achievement')?.value !== '') {
      eduReformFilter.achievement = this.SearchForm.get('achievement')?.value;
    }
    if (this.SearchForm.get('fund')?.value !== '') {
      eduReformFilter.fund = this.SearchForm.get('fund')?.value;
    }

    eduReformFilter.startDateStart = this.SearchForm.get('startDateStart')?.value;
    eduReformFilter.startDateEnd = this.SearchForm.get('startDateEnd')?.value;
    eduReformFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    eduReformFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    eduReformFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    eduReformFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    let teachersInControlArray = this.SearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      eduReformFilter.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }

    console.log(eduReformFilter);
    this.isSearching = true;

    this.eduReformService.getEduReformsByFilter(eduReformFilter, this.pageIndex, this.pageSize).pipe(takeUntil(this.$destroy)).subscribe({
      next: (eduReformPage) => {
        if (eduReformPage) {
          this.eduReformList = eduReformPage.eduReforms;
          this.totalCount = eduReformPage.totalCount;
          this.dataSource = new MatTableDataSource(this.eduReformList);
          this.dataSource.sort = this.sort;
          this.isSearching = false;
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

  editEduReform(eduReform: EduReform) {
    this.router.navigate(['/main/educationreform/edit', eduReform.id]);
  }

  deleteEduReform(eduReform: EduReform) {
    this.eduReformService.deleteEduReform(eduReform.id).pipe(takeUntil(this.$destroy)).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('删除成功', '关闭', {
            duration: 2000
          });
          if (this.eduReformList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getEduReformList();
        } else {
          this.snackBar.open('删除失败', '关闭', {
            duration: 2000
          });
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('删除失败', '关闭', {
          duration: 2000
        });
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
