import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditEduReform, EduReform } from '../../../models/models/eduReform.model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EduReformService } from '../../../services/edureform.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { EdureformformComponent } from '../../../components/edureformform/edureformform.component';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-editedureform',
  standalone: true,
  imports: [DatePipe, MatDividerModule, EdureformformComponent],
  templateUrl: './editedureform.component.html',
  styleUrl: './editedureform.component.scss'
})
export class EditedureformComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  eduReformForm!: FormGroup;
  eduReform!: EduReform;
  userId!: string;
  private destroy$ = new Subject<boolean>();
  teachersInOptions: UserExport[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private eduReformService: EduReformService,
    private authRepository: AuthRepository,
    private snakBar: MatSnackBar,
    private userService: UserService,
  ) { }

  updateEduReform() {
    console.log(this.eduReformForm.value);

    let updateEduReform = new EditEduReform();
    updateEduReform.number = this.eduReformForm.value.number;
    updateEduReform.title = this.eduReformForm.value.title;
    updateEduReform.startDate = this.eduReformForm.value.startDate;
    updateEduReform.duration = this.eduReformForm.value.duration;
    updateEduReform.level = this.eduReformForm.value.level;
    updateEduReform.rank = this.eduReformForm.value.rank;
    updateEduReform.achievement = this.eduReformForm.value.achievement;
    updateEduReform.fund = this.eduReformForm.value.fund;

    let teachersInControlArray = this.eduReformForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      updateEduReform.teachersIn = teachersInControlArray.controls
        .map((control) => control.value.id)
        .filter((id) => id !== this.userId);
    }

    let teachersOutControlArray = this.eduReformForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      updateEduReform.teachersOut = teachersOutControlArray.controls
        .map((control) => control.value);
    }

    console.log(updateEduReform);

    this.eduReformService.updateEduReform(this.eduReform.id, updateEduReform)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (edureform: EduReform | null) => {
          if (edureform) {
            this.eduReform = edureform;
            this.snakBar.open('更新教改项目成功', '关闭', { duration: 3000 });
          } else {
            this.snakBar.open('更新教改项目失败', '关闭', {
              duration: 3000
            });
          }
        },
        error: (error) => {
          console.error(error);
          this.snakBar.open('更新教改项目失败', '关闭', {
            duration: 3000
          });
        }
      });
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.eduReformService.getEduReform(params['id']).
        pipe(takeUntil(this.destroy$)).subscribe({
          next: (edureform: EduReform | null) => {
            if (edureform) {
              this.eduReform = edureform;

              this.eduReformForm = new FormGroup({
                number: new FormControl(this.eduReform.number, [Validators.required]),
                title: new FormControl(this.eduReform.title, [Validators.required]),
                teachersIn: new FormArray([]),
                teachersOut: new FormArray([]),
                startDate: new FormControl(this.eduReform.startDate, [Validators.required]),
                duration: new FormControl(this.eduReform.duration || ''),
                level: new FormControl(this.eduReform.level || ''),
                rank: new FormControl(this.eduReform.rank || ''),
                achievement: new FormControl(this.eduReform.achievement || ''),
                fund: new FormControl(this.eduReform.fund || ''),
              });

              if (this.eduReform.teachersIn) {
                this.eduReform.teachersIn.forEach(teacher => {
                  (this.eduReformForm.get('teachersIn') as FormArray).push(new FormControl(teacher));
                });
              }

              if (this.eduReform.teachersOut) {
                this.eduReform.teachersOut.forEach(teacher => {
                  (this.eduReformForm.get('teachersOut') as FormArray).push(new FormControl(teacher));
                });
              }

              this.snakBar.open('获取教改项目成功', '关闭', { duration: 3000 });
            } else {
              this.snakBar.open('获取教改项目失败', '关闭', {
                duration: 3000
              });
            }
          },
          error: (error) => {
            console.error(error);
            this.snakBar.open('获取教改项目失败', '关闭', {
              duration: 3000
            });
          }
        });
    });

    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.id;
        }
      }
    });

    this.userService.userExports().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.teachersInOptions = users;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
