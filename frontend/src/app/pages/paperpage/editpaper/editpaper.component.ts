import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaperformComponent } from '../../../components/paperform/paperform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { EditPaper, Paper } from '../../../models/models/paper.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { PaperService } from '../../../services/paper.service';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-editpaper',
  standalone: true,
  imports: [DatePipe, MatDividerModule, PaperformComponent],
  templateUrl: './editpaper.component.html',
  styleUrl: './editpaper.component.scss'
})
export class EditpaperComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  paperForm!: FormGroup;
  paper!: Paper;
  userId!: string;
  private destroy$ = new Subject<boolean>();
  teachersInOptions: UserExport[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private paperService: PaperService,
    private authRepository: AuthRepository,
    private snackBar: MatSnackBar,
    private userService: UserService,
  ) { }

  updatePaper(): void {
    console.log(this.paperForm.value);

    let updatePaper = new EditPaper();
    updatePaper.title = this.paperForm.value.title;
    updatePaper.rank = this.paperForm.value.rank;
    updatePaper.journalName = this.paperForm.value.journalName;
    updatePaper.journalLevel = this.paperForm.value.journalLevel;
    updatePaper.publishDate = this.paperForm.value.publishDate;

    let teachersInControlArray = this.paperForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      updatePaper.teachersIn = teachersInControlArray.controls
        .map((control) => control.value.id)
        .filter((id) => id !== this.userId);
    }

    let teachersOutControlArray = this.paperForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      updatePaper.teachersOut = teachersOutControlArray.controls
        .map((control) => control.value);
    }

    console.log(updatePaper);

    this.paperService.updatePaper(this.paper.id, updatePaper)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (paper) => {
          if (paper) {
            this.paper = paper;
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

    this.activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.paperService.getPaper(params['id'])
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (paper) => {
            if (paper) {
              this.paper = paper;
              this.paperForm = new FormGroup({
                title: new FormControl(paper.title, [Validators.required]),
                rank: new FormControl(paper.rank || '',),
                journalName: new FormControl(paper.journalName || '',),
                journalLevel: new FormControl(paper.journalLevel || '',),
                publishDate: new FormControl(paper.publishDate, [Validators.required]),
                teachersIn: new FormArray([]),
                teachersOut: new FormArray([]),
              });

              if (this.paper.teachersIn) {
                this.paper.teachersIn.forEach((teacher) => {
                  (this.paperForm.get('teachersIn') as FormArray).push(new FormControl(teacher));
                });
              }

              if (this.paper.teachersOut) {
                this.paper.teachersOut.forEach((teacher) => {
                  (this.paperForm.get('teachersOut') as FormArray).push(new FormControl(teacher));
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

    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.userService.userExports().pipe(takeUntil(this.destroy$)).subscribe({
      next: (userExports) => {
        this.teachersInOptions = userExports;
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
