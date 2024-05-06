import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonographformComponent } from '../../../components/monographform/monographform.component';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { EditMonograph, Monograph } from '../../../models/models/monograph.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { MonographService } from '../../../services/monograph.service';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-editmonograph',
  standalone: true,
  imports: [MonographformComponent, MatDividerModule, DatePipe],
  templateUrl: './editmonograph.component.html',
  styleUrl: './editmonograph.component.scss'
})
export class EditmonographComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  monograph!: Monograph;
  monographForm!: FormGroup;
  userId!: string;
  private destroy$ = new Subject<boolean>();
  teachersInOptions: UserExport[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private monographService: MonographService,
    private authRepository: AuthRepository,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) {

  }

  updateMonograph(): void {
    console.log(this.monographForm.value);

    let updateMonograph = new EditMonograph();
    updateMonograph.title = this.monographForm.get('title')?.value;
    updateMonograph.rank = this.monographForm.get('rank')?.value;
    updateMonograph.publishLevel = this.monographForm.get('publishLevel')?.value;
    updateMonograph.publishDate = this.monographForm.get('publishDate')?.value;

    let teachersInControlArray = this.monographForm.get('teachersInControl') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      updateMonograph.teachersIn = teachersInControlArray.controls
        .map((control) => control.value.id)
        .filter((id) => id !== this.userId);
    }

    let teachersOutControlArray = this.monographForm.get('teachersOutControl') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      updateMonograph.teachersOut = teachersOutControlArray.controls
        .map((control) => control.value);
    }

    console.log(updateMonograph);

    this.monographService.updateMonograph(this.monograph.id, updateMonograph)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
          if (result) {
            this.monograph = result;
            this.snackBar.open('更新成功', '关闭', { duration: 2000 });
          } else {
            this.snackBar.open('更新失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('更新失败', '关闭', { duration: 2000 });
        }

      });
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.monographService.getMonograph(params['id'])
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (result) => {
            if (result) {
              this.monograph = result;
              this.monographForm = new FormGroup({
                title: new FormControl(this.monograph.title, [Validators.required]),
                rank: new FormControl(this.monograph.rank || '',),
                publishLevel: new FormControl(this.monograph.publishLevel || ''),
                publishDate: new FormControl(this.monograph.publishDate, [Validators.required]),
                teachersIn: new FormArray([]),
                teachersOut: new FormArray([]),
              });

              if (this.monograph.teachersIn) {
                this.monograph.teachersIn.forEach((teacher) => {
                  (this.monographForm.get('teachersIn') as FormArray).push(new FormControl(teacher));
                });
              }

              if (this.monograph.teachersOut) {
                this.monograph.teachersOut.forEach((teacher) => {
                  (this.monographForm.get('teachersOut') as FormArray).push(new FormControl(teacher));
                });
              }

              this.snackBar.open('获取数据成功', '关闭', { duration: 2000 });
            } else {
              this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
            }
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
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
      next: (result) => {
        this.teachersInOptions = result;
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
