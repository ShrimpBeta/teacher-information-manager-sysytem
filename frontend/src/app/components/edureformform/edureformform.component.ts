import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UserExport } from '../../models/models/user.model';

@Component({
  selector: 'app-edureformform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule,
    MatDividerModule, ReactiveFormsModule, MatDatepickerModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './edureformform.component.html',
  styleUrl: './edureformform.component.scss'
})
export class EdureformformComponent {
  @Input() buttonLabel!: string;
  @Input() eduReformForm!: FormGroup;
  @Input() teachersInOptions!: UserExport[];
  @Output() submitForm = new EventEmitter<any>();

  teachersInCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('teacherInInput') teachersInInput!: ElementRef<HTMLInputElement>;

  constructor(
    private snackBar: MatSnackBar,
  ) {

  }

  onSubmit() {
    if (this.eduReformForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', {
        duration: 2000,
      });
      return;
    }
    this.submitForm.emit();
  }

  get teachersIn() {
    return this.eduReformForm.get('teachersIn') as FormArray;
  }

  get teachersOut() {
    return this.eduReformForm.get('teachersOut') as FormArray;
  }

  teachersInSelected(event: MatAutocompleteSelectedEvent) {
    let selectedTeacherIn: UserExport = event.option.value;
    this.teachersIn.push(new FormControl(selectedTeacherIn));
    this.teachersInInput.nativeElement.value = '';
    this.teachersInCtrl.setValue(null);
  }

  addTeachersIn(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      this.teachersIn.push(new FormControl(value));
    }
    event.chipInput!.clear();
    this.teachersInCtrl.setValue(null);
  }

  addTeachersOut(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      this.teachersOut.push(new FormControl(value));
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
      this.teachersIn.at(index).setValue(value);
    } else {
      this.teachersIn.removeAt(index);
    }
  }

  editTeachersOut(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      this.teachersOut.at(index).setValue(value);
    } else {
      this.teachersOut.removeAt(index);
    }
  }
}
