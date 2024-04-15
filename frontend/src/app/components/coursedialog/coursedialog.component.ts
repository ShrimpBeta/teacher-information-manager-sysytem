import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArrayEmptyValidator } from '../../shared/formvalidator/arrayempty.validator';
import { ColorHueModule } from 'ngx-color/hue';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-coursedialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, ReactiveFormsModule,
    MatChipsModule, ColorHueModule
  ],
  templateUrl: './coursedialog.component.html',
  styleUrl: './coursedialog.component.scss'
})
export class CoursedialogComponent {

  courseForm!: FormGroup;
  buttonLabel!: string
  weeks!: number[];

  constructor(
    public dialogRef: MatDialogRef<CoursedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.weeks = Array.from({ length: data.weekCount }, (v, k) => k + 1);
    this.buttonLabel = data.buttonLabel;
    if (data.course) {

    } else {
      this.courseForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        teacherNames: new FormControl('', [Validators.required]),
        courseLocation: new FormControl('',),
        courseType: new FormControl('',),
        courseWeeks: new FormArray([], [ArrayEmptyValidator()]),
        classTimes: new FormArray([], [ArrayEmptyValidator()]),
        studentCount: new FormControl(0,),
        color: new FormControl('#7bdcb5',),
      });
      this.weeks.forEach(week => {
        this.courseWeeks.push(new FormControl(week));
      });
    }

  }

  changeColor(event: ColorEvent): void {
    this.courseForm.get('color')?.setValue(event.color.hex);
  }

  get classTimes(): FormArray {
    return this.courseForm.get('classTimes') as FormArray;
  }

  get courseWeeks(): FormArray {
    return this.courseForm.get('courseWeeks') as FormArray;
  }

  toggleCourseWeek(week: number): void {
    let index = this.courseWeeks.value.indexOf(week);
    if (index >= 0) {
      this.courseWeeks.removeAt(index);
    } else {
      this.courseWeeks.push(new FormControl(week));
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.courseForm.invalid) {
      return;
    }

    this.dialogRef.close(this.courseForm.value);
  }

}
