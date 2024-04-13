import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { CreateclassscheduledialogComponent } from '../../../components/createclassscheduledialog/createclassscheduledialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditClassSchedule, NewClassScheduleData } from '../../../models/models/classSchedule.model';
import { ClassScheduleService } from '../../../services/classschedule.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-overviewclassschedule',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink, DatePipe],
  templateUrl: './overviewclassschedule.component.html',
  styleUrl: './overviewclassschedule.component.scss'
})
export class OverviewclassscheduleComponent implements OnInit, OnDestroy {

  private destory$ = new Subject<boolean>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private classScheduleService: ClassScheduleService,
  ) { }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateclassscheduledialogComponent, {
      width: '450px',
      height: '395px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result !== '') {
          this.createClassSchedule(result)
        }
      }
    });
  }

  createClassSchedule(newClassScheduleData: NewClassScheduleData) {
    let newClassSchedule = new EditClassSchedule();

    newClassSchedule.termName = newClassScheduleData.termName;
    newClassSchedule.startDate = newClassScheduleData.startDate;
    newClassSchedule.weekCount = newClassScheduleData.weekCount;

    this.classScheduleService.createClassSchedule(newClassSchedule)
      .pipe(takeUntil(this.destory$)).subscribe({
        next: (result) => {
          if (result) {
            this.snackBar.open('创建课表成功', '关闭', {
              duration: 2000,
            });
            this.router.navigate(['/main/classschedule/edit', result.id]);
          } else {
            this.snackBar.open('创建课表失败', '关闭', {
              duration: 2000,
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('创建课表失败', '关闭', {
            duration: 2000,
          });
        }
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }

}
