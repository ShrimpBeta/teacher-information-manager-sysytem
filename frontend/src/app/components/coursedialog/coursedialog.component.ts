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
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsIntegerValidator } from '../../shared/formvalidator/integer.validato';
import { StartEndValidator } from '../../shared/formvalidator/startend.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-coursedialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, ReactiveFormsModule,
    MatChipsModule, ColorHueModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './coursedialog.component.html',
  styleUrl: './coursedialog.component.scss'
})
export class CoursedialogComponent {

  courseForm!: FormGroup;
  buttonLabel!: string;
  weeks!: number[];
  periodLength!: number;

  daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  constructor(
    public dialogRef: MatDialogRef<CoursedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {
    console.log(data);
    this.weeks = Array.from({ length: data.weekCount }, (v, k) => k + 1);
    this.buttonLabel = data.buttonLabel;
    this.periodLength = data.periodLength;

    if (data.course) {
      this.courseForm = new FormGroup({
        name: new FormControl(data.course.courseName, [Validators.required]),
        teacherNames: new FormControl(data.course.teacherNames, [Validators.required]),
        courseLocation: new FormControl(data.course.courseLocation),
        courseType: new FormControl(data.course.courseType),
        courseWeeks: new FormArray([], [ArrayEmptyValidator()]),
        courseTimes: new FormArray([], [ArrayEmptyValidator()]),
        studentCount: new FormControl(data.course.studentCount, [IsIntegerValidator()]),
        color: new FormControl(data.course.color),
      });

      this.weeks.forEach(week => {
        if (data.course.courseWeeks.includes(week)) {
          this.courseWeeks.push(new FormControl(week));
        }
      });

      data.course.courseTimes.forEach((classTime: any) => {
        let group = new FormGroup({
          dayOfWeek: new FormControl(classTime.dayOfWeek, [Validators.required, IsIntegerValidator()]),
          start: new FormControl(classTime.start, [Validators.required, IsIntegerValidator()]),
          end: new FormControl(classTime.end, [Validators.required, IsIntegerValidator()]),
        });

        group.setValidators(StartEndValidator)

        this.courseTimes.push(group);
      });

      console.log(this.courseForm);

    } else {
      this.courseForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        teacherNames: new FormControl('', [Validators.required]),
        courseLocation: new FormControl('',),
        courseType: new FormControl('',),
        courseWeeks: new FormArray([], [ArrayEmptyValidator()]),
        courseTimes: new FormArray([], [ArrayEmptyValidator()]),
        studentCount: new FormControl(0, [IsIntegerValidator()]),
        color: new FormControl('#7bdcb5',),
      });

      this.weeks.forEach(week => {
        this.courseWeeks.push(new FormControl(week));
      });

      let group = new FormGroup({
        dayOfWeek: new FormControl(1, [Validators.required, IsIntegerValidator()]),
        start: new FormControl(1, [Validators.required, IsIntegerValidator()]),
        end: new FormControl(1, [Validators.required, IsIntegerValidator()]),
      });

      group.setValidators(StartEndValidator)

      this.courseTimes.push(group);
    }

  }

  showForm(): void {
    console.log(this.courseForm);
  }

  addCourseTime(): void {
    let group = new FormGroup({
      dayOfWeek: new FormControl(1, [Validators.required, IsIntegerValidator()]),
      start: new FormControl(1, [Validators.required, IsIntegerValidator()]),
      end: new FormControl(1, [Validators.required, IsIntegerValidator()]),
    });

    group.setValidators(StartEndValidator)

    this.courseTimes.push(group);
  }

  removeCourseTime(index: number): void {
    if (this.courseTimes.length > 1) {
      this.courseTimes.removeAt(index);
    } else {
      this.snackBar.open('至少需要一个上课时间', '关闭', { duration: 2000, });
    }
  }

  changeColor(event: ColorEvent): void {
    this.courseForm.get('color')?.setValue(event.color.hex);
  }

  get courseTimes(): FormArray {
    return this.courseForm.get('courseTimes') as FormArray;
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
      if (this.courseForm.get('classTimes')?.invalid) {
        this.snackBar.open('上课时间填写有误', '关闭', { duration: 2000, });
      }
      if (this.courseForm.get('courseWeeks')?.invalid) {
        this.snackBar.open('上课周次为空', '关闭', { duration: 2000, });
      }
      return;
    }

    let classTimes = this.courseTimes.value;
    let duplicates = classTimes.some((classTime: any, index: number) =>
      classTimes.some((otherClassTime: any, otherIndex: number) =>
        otherIndex !== index && JSON.stringify(classTime) === JSON.stringify(otherClassTime)
      )
    );
    if (duplicates) {
      this.snackBar.open('上课时间重复', '关闭', { duration: 2000, });
      return;
    }

    this.dialogRef.close(this.courseForm.value);
  }

}
