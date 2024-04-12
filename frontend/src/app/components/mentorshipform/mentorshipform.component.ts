import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mentorshipform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatDividerModule,
    ReactiveFormsModule, MatDatepickerModule, MatChipsModule],
  templateUrl: './mentorshipform.component.html',
  styleUrl: './mentorshipform.component.scss'
})
export class MentorshipformComponent {
  @Input() mentorshipForm!: FormGroup;
  @Input() buttonLabel!: string;

  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  onSubmit() {
    if (this.mentorshipForm.invalid) {
      if (this.mentorshipForm.get('studentNames')!.errors) {
        this.snackBar.open('学生姓名不能为空', '关闭', { duration: 2000 });
      } else {
        this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      }
      return;
    }
    this.submitForm.emit();
  }

  get studentNames() {
    return this.mentorshipForm.get('studentNames') as FormArray;
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
      let index = this.studentNames.controls.findIndex((control) => control.value === value);
      if (index === -1) {
        this.studentNames.at(index).setValue(value);
      }
    } else {
      this.studentNames.removeAt(index);
    }
  }
}
