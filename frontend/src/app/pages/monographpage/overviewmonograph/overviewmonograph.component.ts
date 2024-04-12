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
import { RouterLink } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UserService } from '../../../services/user.service';
import { UserExport } from '../../../models/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Monograph, MonographFilter } from '../../../models/models/monograph.model';
import { MonographService } from '../../../services/monograph.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-overviewmonograph',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatDatepickerModule, MatChipsModule, MatAutocompleteModule, MatTooltipModule,
    MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './overviewmonograph.component.html',
  styleUrl: './overviewmonograph.component.scss'
})
export class OverviewmonographComponent {
  SearchForm!: FormGroup;
  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  teachersInOptions: UserExport[] = [];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  $destroy: Subject<boolean> = new Subject<boolean>();

  monographList: Monograph[] = []

  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  isSearching: boolean = false;

  constructor(
    private userService: UserService,
    private monographService: MonographService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.SearchForm = new FormGroup({
      title: new FormControl(''),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishLevel: new FormControl(''),
      rank: new FormControl(''),
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

    this.getMonoGraphList();
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }


  onSearch() {
    this.pageIndex = 0;
    this.getMonoGraphList();
  }

  clearForm() {
    this.SearchForm.reset();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getMonoGraphList();
  }

  deleteMonograph(monograph: Monograph) {
    this.monographService.deleteMonograph(monograph.id).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('删除成功', '关闭', {
            duration: 2000,
          });
          if (this.monographList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getMonoGraphList();
        } else {
          this.snackBar.open('删除失败', '关闭', {
            duration: 2000,
          });
        }
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('删除失败', '关闭', {
          duration: 2000,
        });
      }
    });
  }

  getMonoGraphList() {
    console.log(this.SearchForm);
    let monographFilter = new MonographFilter();

    if (this.SearchForm.get('title')?.value) {
      monographFilter.title = this.SearchForm.get('title')?.value;
    }
    if (this.SearchForm.get('publishLevel')?.value) {
      monographFilter.publishLevel = this.SearchForm.get('publishLevel')?.value;
    }
    if (this.SearchForm.get('rank')?.value) {
      monographFilter.rank = this.SearchForm.get('rank')?.value;
    }

    monographFilter.publishDateStart = this.SearchForm.get('publishDateStart')?.value;
    monographFilter.publishDateEnd = this.SearchForm.get('publishDateEnd')?.value;
    monographFilter.createdStart = this.SearchForm.get('createdStart')?.value;
    monographFilter.createdEnd = this.SearchForm.get('createdEnd')?.value;
    monographFilter.updatedStart = this.SearchForm.get('updatedStart')?.value;
    monographFilter.updatedEnd = this.SearchForm.get('updatedEnd')?.value;

    let teachersInControlArray = this.SearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      monographFilter.teachersIn = teachersInControlArray.controls.map((control: AbstractControl) => {
        return control.value.id;
      });
    }

    let teachersOutControlArray = this.SearchForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      monographFilter.teachersOut = teachersOutControlArray.controls.map((control: AbstractControl) => {
        return control.value;
      });
    }

    console.log(monographFilter);
    this.isSearching = true;

    this.monographService.getMonographsByFilter(monographFilter, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        if (response) {
          this.monographList = response.monographs;
          this.totalCount = response.totalCount;
        } else {
          this.snackBar.open('获取数据失败', '关闭', {
            duration: 2000,
          });
        }
        this.isSearching = false;
      },
      error: (error) => {
        console.log(error);
        this.snackBar.open('获取数据失败', '关闭', {
          duration: 2000,
        });
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
