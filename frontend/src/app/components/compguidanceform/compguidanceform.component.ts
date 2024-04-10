import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-compguidanceform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule,
    MatDividerModule, ReactiveFormsModule, MatDatepickerModule, MatChipsModule],
  templateUrl: './compguidanceform.component.html',
  styleUrl: './compguidanceform.component.scss'
})
export class CompguidanceformComponent {
  @Input() buttonLabel!: string;
  @Input() compGuidanceForm!: FormGroup;

  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  onSubmit() {
    console.log(this.compGuidanceForm);

    if (this.compGuidanceForm.invalid) {
      if (this.compGuidanceForm.get('studentNames')!.errors) {
        this.snackBar.open('请填写学生姓名', '关闭', { duration: 2000 });
      } else {
        this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      }
      return;
    }
    this.submitForm.emit();
  }

  get studentNames() {
    return this.compGuidanceForm.get('studentNames') as FormArray;
  }

  addStudentName(event: MatChipInputEvent) {
    let value = (event.value || '').trim();
    if (value) {
      this.studentNames.push(new FormControl(value));
    }
    event.chipInput!.clear();
  }

  removeStudentName(index: number) {
    this.studentNames.removeAt(index);
  }

  editStudentName(event: MatChipEditedEvent, index: number) {
    let value = (event.value || '').trim();
    if (value) {
      this.studentNames.at(index).setValue(value);
    } else {
      this.studentNames.removeAt(index);
    }
  }

}
