import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NewClassScheduleData } from '../../models/models/classSchedule.model';

@Component({
  selector: 'app-createclassscheduledialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, ReactiveFormsModule,
    MatDatepickerModule],
  template: `
    <h2 mat-dialog-title>创建课程表</h2>
    <div mat-dialog-content style="width: 100%;">
      <div [formGroup]="classScheduleForm" style="margin-top: 20px;">
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>课程表名称</mat-label>
          <input matInput placeholder="课程表名称" formControlName="nameControl">
          <mat-error>课程表名称不能为空</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>开始日期</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="startDate" placeholder="开始日期">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error>开始日期不能为空</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>学期周数</mat-label>
          <input matInput type="number" formControlName="weekCount" placeholder="学期周数">
          <mat-error>周数不能为空</mat-error>
        </mat-form-field>
      </div>
    </div>
    <div mat-dialog-actions style="display:flex;flex-direction:row; gap:20px; justify-content:center; margin-bottom:0.5rem;">
      <button mat-raised-button mat-dialog-close>取消</button>
      <button mat-raised-button color="primary" [disabled]="classScheduleForm.invalid" (click)="onDialogClose()">创建</button>
    </div>
  `,
  styles: ``,
})
export class CreateclassscheduledialogComponent {
  classScheduleForm: FormGroup = new FormGroup({
    nameControl: new FormControl('', [Validators.required]),
    startDate: new FormControl(new Date(), [Validators.required]),
    weekCount: new FormControl(17, [Validators.required]),
  });
  constructor(public dialogRef: MatDialogRef<CreateclassscheduledialogComponent>) { }

  onDialogClose() {
    if (this.classScheduleForm.invalid) {
      return;
    }
    let newClassScheduleData = new NewClassScheduleData();
    newClassScheduleData.termName = this.classScheduleForm.get('nameControl')?.value;
    newClassScheduleData.startDate = this.classScheduleForm.get('startDate')?.value;
    newClassScheduleData.weekCount = this.classScheduleForm.get('weekCount')?.value;
    this.dialogRef.close(newClassScheduleData);
  }
}
