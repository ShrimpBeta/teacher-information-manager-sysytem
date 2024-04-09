import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserExport } from '../../models/models/user.model';

@Component({
  selector: 'app-paperform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule,
    MatDividerModule, ReactiveFormsModule, MatDatepickerModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './paperform.component.html',
  styleUrl: './paperform.component.scss'
})
export class PaperformComponent {
  @Input() buttonLabel!: string;
  @Input() paperForm!: FormGroup;
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
    if (this.paperForm.valid) {
      this.submitForm.emit();
    } else {
      this.snackBar.open('请检查表单', '关闭', {
        duration: 2000,
      });
    }
  }

  get teachersIn() {
    return this.paperForm.get('teachersIn') as FormArray;
  }

  get teachersOut() {
    return this.paperForm.get('teachersOut') as FormArray;
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
