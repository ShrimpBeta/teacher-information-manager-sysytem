import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassScheduleService } from '../../../services/classschedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { ClassSchedule } from '../../../models/models/classSchedule.model';

@Component({
  selector: 'app-editclassschedule',
  standalone: true,
  imports: [],
  templateUrl: './editclassschedule.component.html',
  styleUrl: './editclassschedule.component.scss'
})
export class EditclassscheduleComponent implements OnInit, OnDestroy {

  private destory$ = new Subject<boolean>();
  classSchedule: ClassSchedule | null = null;

  daysOfWeek = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  periods = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private classScheduleService: ClassScheduleService,
    private snackBar: MatSnackBar,
  ) { }

  edit() {

  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.classScheduleService.getClassSchedule(params['id'])
        .pipe(takeUntil(this.destory$)).subscribe({
          next: (result) => {
            if (result) {
              this.classSchedule = result;
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
