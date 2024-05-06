import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../models/models/user.model';
import { UserService } from '../../services/user.service';
import { ReportService } from '../../services/report.service';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-workreport',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, ReactiveFormsModule, MatDividerModule, MatInputModule, MatFormFieldModule,
    MatIconModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './workreport.component.html',
  styleUrl: './workreport.component.scss'
})
export class WorkreportComponent {
  SearchForm!: FormGroup;
  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  now = new Date();

  teachersInOptions: UserExport[] = [];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  $destroy: Subject<boolean> = new Subject<boolean>();

  isSearching: boolean = false;

  constructor(
    private userService: UserService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    this.SearchForm = new FormGroup({
      classSchedule: new FormControl(true),
      mentorship: new FormControl(true),
      compGuidance: new FormControl(true),
      uGPGGuidance: new FormControl(true),
      eduReform: new FormControl(true),
      monograph: new FormControl(true),
      paper: new FormControl(true),
      sciResearch: new FormControl(true),
      startDate: new FormControl(new Date(new Date(this.now).setFullYear(this.now.getFullYear() - 3))),
      endDate: new FormControl(this.now),
      teachersIn: new FormArray([]),
      specifyTeacherIn: new FormControl(false),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (users: UserExport[]) => {
        this.teachersInOptions = users;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

  resetForm() {
    this.SearchForm = new FormGroup({
      classSchedule: new FormControl(true),
      mentorship: new FormControl(true),
      compGuidance: new FormControl(true),
      uGPGGuidance: new FormControl(true),
      eduReform: new FormControl(true),
      monograph: new FormControl(true),
      paper: new FormControl(true),
      sciResearch: new FormControl(true),
      startDate: new FormControl(new Date(new Date(this.now).setFullYear(this.now.getFullYear() - 3))),
      endDate: new FormControl(this.now),
      teachersIn: new FormArray([]),
      specifyTeacherIn: new FormControl(false),
    });
    this.teachersInCtrl.setValue(null);
  }

  getReport() {

  }

  export() {

  }

  get teachersIn() {
    return this.SearchForm.get('teachersIn') as FormArray;
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

  removeTeachersIn(index: number) {
    this.teachersIn.removeAt(index);
  }
}
