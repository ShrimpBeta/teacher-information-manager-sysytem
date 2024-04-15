import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassScheduleService } from '../../../services/classschedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { ClassSchedule, Course, EditClassSchedule } from '../../../models/models/classSchedule.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CoursedialogComponent } from '../../../components/coursedialog/coursedialog.component';

@Component({
  selector: 'app-editclassschedule',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDatepickerModule,
    MatDividerModule, ReactiveFormsModule],
  templateUrl: './editclassschedule.component.html',
  styleUrl: './editclassschedule.component.scss'
})
export class EditclassscheduleComponent implements OnInit, OnDestroy {

  private destory$ = new Subject<boolean>();
  classSchedule: ClassSchedule | null = null;

  daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  periods = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];

  currentWeek = 1;
  nowWeek = 1;

  editDrawer = false;

  classScheduleMatrix: CourseCell[][] = [];

  classScheduleForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private classScheduleService: ClassScheduleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }



  updateClassSchedule(): void {
    if (this.classScheduleForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', {
        duration: 2000,
      });
      return;
    }

    let classSchedule = new EditClassSchedule();
    classSchedule.termName = this.classScheduleForm.get('name')?.value;
    classSchedule.startDate = this.classScheduleForm.get('startDate')?.value;
    classSchedule.weekCount = this.classScheduleForm.get('weekCount')?.value;

    this.classScheduleService.updateClassSchedule(this.classSchedule!.id, classSchedule)
      .pipe(takeUntil(this.destory$)).subscribe({
        next: (result) => {
          if (result) {
            this.classSchedule = result;
            this.classScheduleMatrix = this.convertToMatrix(this.classSchedule);

            this.nowWeek = this.getWeekNumber(this.classSchedule.startDate);
            if (this.nowWeek > this.classSchedule.weekCount) {
              this.currentWeek = this.classSchedule.weekCount;
            } else {
              this.currentWeek = this.nowWeek;
            }

            this.classScheduleForm.patchValue({
              name: this.classSchedule?.termName,
              startDate: this.classSchedule?.startDate,
              weekCount: this.classSchedule?.weekCount
            });

            this.snackBar.open('更新课表成功', '关闭', { duration: 2000 });
          } else {
            this.snackBar.open('更新课表失败', '关闭', {
              duration: 2000,
            });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('更新课表失败', '关闭', {
            duration: 2000,
          });
        }
      });

    this.editDrawer = false;
  }

  createCourse(): void {
    const dialogRef = this.dialog.open(CoursedialogComponent, {
      width: '600px',
      height: '500px',
      data: { course: null, buttonLabel: '创建', weekCount: this.classSchedule?.weekCount }
    });
  }

  openEditCourse(course: Course) {

  }

  openEditDrawer(): void {
    this.editDrawer = true
    this.classScheduleForm.patchValue({
      name: this.classSchedule?.termName,
      startDate: this.classSchedule?.startDate,
      weekCount: this.classSchedule?.weekCount
    });
  }

  convertToMatrix(classSchedule: ClassSchedule | null): CourseCell[][] {
    if (!classSchedule) return [];

    let matrix: CourseCell[][] = Array(7).fill(null).map(() => Array(this.periods.length).fill(null));

    for (let course of classSchedule.courses) {
      for (let courseTime of course.courseTimes) {
        let dayOfWeek = courseTime.dayOfWeek
        let courseCell = new CourseCell();
        courseCell.couresId = course.id
        courseCell.start = courseTime.start
        courseCell.end = courseTime.end
        courseCell.teacherNames = course.teacherNames
        courseCell.courseName = course.courseName
        courseCell.courseType = course.courseType
        courseCell.courseLocation = course.courseLocation
        courseCell.studentCount = course.studentCount
        courseCell.color = course.color

        for (let i = courseTime.start - 1; i < courseTime.end; i++) {
          matrix[dayOfWeek][i] = courseCell;
        }
      }
    }

    return matrix;
  }

  getWeekNumber(startDate: Date): number {
    let now = new Date();
    let start = new Date(startDate);
    let diffInTime = now.getTime() - start.getTime();
    let diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    let startDay = start.getDay();
    let nowDay = now.getDay();
    let weekNumber = Math.floor(diffInDays / 7);
    if (startDay >= nowDay) weekNumber++;
    return weekNumber;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.classScheduleService.getClassSchedule(params['id'])
        .pipe(takeUntil(this.destory$)).subscribe({
          next: (result) => {
            if (result) {
              this.classSchedule = result;
              this.classScheduleMatrix = this.convertToMatrix(this.classSchedule);
              this.nowWeek = this.getWeekNumber(this.classSchedule.startDate);
              if (this.nowWeek > this.classSchedule.weekCount) {
                this.currentWeek = this.classSchedule.weekCount;
              } else {
                this.currentWeek = this.nowWeek;
              }

              this.classScheduleForm = new FormGroup({
                name: new FormControl(this.classSchedule.termName || '', [Validators.required]),
                startDate: new FormControl(this.classSchedule.startDate || null, [Validators.required]),
                weekCount: new FormControl(this.classSchedule.weekCount || 0, [Validators.required]),
              });

              console.log(this.classSchedule);
              this.snackBar.open('获取课表成功', '关闭', { duration: 2000 });
            } else {
              this.snackBar.open('获取课表失败', '关闭', {
                duration: 2000,
              });
            }
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open('获取课表失败', '关闭', {
              duration: 2000,
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }
}

class CourseCell {
  couresId: string | null = null;
  start: number | null = null;
  end: number | null = null;
  teacherNames: string | null = null;
  courseName: string | null = null;
  courseType: string | null = null;
  courseLocation: string | null = null;
  courseWeeks: number[] | null = null;
  studentCount: number | null = null;
  color: string | null = null;
}
