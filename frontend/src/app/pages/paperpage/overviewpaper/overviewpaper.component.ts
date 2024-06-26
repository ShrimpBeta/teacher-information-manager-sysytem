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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Paper, PaperFilter } from '../../../models/models/paper.model';
import { PaperService } from '../../../services/paper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewpaper',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatAutocompleteModule, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewpaper.component.html',
  styleUrl: './overviewpaper.component.scss'
})
export class OverviewpaperComponent implements OnInit, OnDestroy {
  SearchForm!: FormGroup;
  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  teachersInOptions: UserExport[] = [];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  $destroy: Subject<boolean> = new Subject<boolean>();

  displayedColumns: string[] = ['select', 'action', 'title', 'teachersIn', 'teachersOut', 'publishDate', 'journalName', 'journalLevel', 'rank', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<Paper>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Paper>(true, []);

  paperList: Paper[] = [];

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  isSearching: boolean = false;

  constructor(
    private userService: UserService,
    private paperService: PaperService,
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

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      title: new FormControl(''),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      rank: new FormControl(''),
      journalName: new FormControl(''),
      journalLevel: new FormControl(''),
      publishDateStart: new FormControl(null),
      publishDateEnd: new FormControl(null),
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

    this.getPaperList();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  onSearch() {
    this.pageIndex = 0;
    this.getPaperList();
  }

  clearForm() {
    this.SearchForm = new FormGroup({
      title: new FormControl(''),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      rank: new FormControl(''),
      journalName: new FormControl(''),
      journalLevel: new FormControl(''),
      publishDateStart: new FormControl(null),
      publishDateEnd: new FormControl(null),
      createdStart: new FormControl(null),
      createdEnd: new FormControl(null),
      updatedStart: new FormControl(null),
      updatedEnd: new FormControl(null),
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPaperList();
  }

  editPaper(paper: Paper) {
    this.router.navigate(['/main/paper/edit', paper.id]);
  }

  deletePaper(paper: Paper) {
    this.paperService.deletePaper(paper.id).pipe(takeUntil(this.$destroy)).subscribe({
      next: (result) => {
        if (result) {
          this.snackBar.open('删除成功', '关闭', { duration: 2000 });
          if (this.paperList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getPaperList();
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

  getPaperList() {
    console.log(this.SearchForm);
    if (this.SearchForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }

    let paperFilter = new PaperFilter();

    if (this.SearchForm.get('title')?.value) {
      paperFilter.title = this.SearchForm.get('title')?.value;
    }
    if (this.SearchForm.get('teachersOut')?.value.length > 0) {
      paperFilter.teachersOut = this.SearchForm.get('teachersOut')?.value;
    }
    if (this.SearchForm.get('rank')?.value) {
      paperFilter.rank = this.SearchForm.get('rank')?.value;
    }
    if (this.SearchForm.get('journalName')?.value) {
      paperFilter.journalName = this.SearchForm.get('journalName')?.value;
    }
    if (this.SearchForm.get('journalLevel')?.value) {
      paperFilter.journalLevel = this.SearchForm.get('journalLevel')?.value;
    }

    paperFilter.publishDateStart = this.SearchForm.get('publishDateStart')?.value;
    paperFilter.publishDateEnd = this.SearchForm.get('publishDateEnd')?.value;

    let teachesInContorlArray = this.SearchForm.get('teachersIn') as FormArray;
    if (teachesInContorlArray && teachesInContorlArray.controls.length > 0) {
      paperFilter.teachersIn = teachesInContorlArray.controls.map((control) => control.value.id);
    }

    console.log(paperFilter);
    this.isSearching = true;

    this.paperService.getPapersByFilter(paperFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.$destroy)).subscribe({
        next: (paperPage) => {
          if (paperPage) {
            this.paperList = paperPage.papers;
            this.totalCount = paperPage.totalCount;
            this.dataSource = new MatTableDataSource(this.paperList);
            this.dataSource.sort = this.sort;
            this.isSearching = false;
          } else {
            this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          this.isSearching = false;
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

export class PaperExport {
  teachersIn: string = ""
  teachersOut: string = ""
  title: string = ""
  publishDate?: Date
  rank: string = ""
  journalName: string = ""
  journalLevel: string = ""
}
