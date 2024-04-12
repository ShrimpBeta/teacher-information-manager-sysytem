import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditAwardRecord, EditSciResearch, SciResearch } from '../../../models/models/sciResearch.model';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { SciResearchService } from '../../../services/sciresearch.service';
import { UserService } from '../../../services/user.service';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { SciresearchformComponent } from '../../../components/sciresearchform/sciresearchform.component';

@Component({
  selector: 'app-editsciresearch',
  standalone: true,
  imports: [DatePipe, MatDividerModule, SciresearchformComponent],
  templateUrl: './editsciresearch.component.html',
  styleUrl: './editsciresearch.component.scss'
})
export class EditsciresearchComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  sciResearchForm!: FormGroup;
  sciResearch!: SciResearch;
  userId!: string;
  private destroy$ = new Subject<boolean>();
  teachersInOptions: UserExport[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private sciResearchService: SciResearchService,
    private userService: UserService,
    private authRepository: AuthRepository,
    private snackBar: MatSnackBar,
  ) { }

  updateSciResearch(): void {
    console.log(this.sciResearchForm.value);

    let updateSciResearch = new EditSciResearch();

    updateSciResearch.title = this.sciResearchForm.get('title')?.value;
    updateSciResearch.number = this.sciResearchForm.get('number')?.value;
    updateSciResearch.duration = this.sciResearchForm.get('duration')?.value;
    updateSciResearch.level = this.sciResearchForm.get('level')?.value;
    updateSciResearch.rank = this.sciResearchForm.get('rank')?.value;
    updateSciResearch.achievement = this.sciResearchForm.get('achievement')?.value;
    updateSciResearch.fund = this.sciResearchForm.get('fund')?.value;
    updateSciResearch.startDate = this.sciResearchForm.get('startDate')?.value;

    let teachersInControlArray = this.sciResearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      updateSciResearch.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }
    let teachersOutControlArray = this.sciResearchForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      updateSciResearch.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    let awardRecordsControlArray = this.sciResearchForm.get('awardRecords') as FormArray;
    if (awardRecordsControlArray && awardRecordsControlArray.length > 0) {
      updateSciResearch.awards = awardRecordsControlArray.controls.map((control) => {
        let newAwardRecord = new EditAwardRecord();
        newAwardRecord.awardName = control.get('awardName')?.value;
        newAwardRecord.awardLevel = control.get('awardLevel')?.value;
        newAwardRecord.awardRank = control.get('awardRank')?.value;
        newAwardRecord.awardDate = control.get('awardDate')?.value;
        return newAwardRecord;
      });
    }

    console.log(updateSciResearch);

    this.sciResearchService.updateSciResearch(this.sciResearch.id, updateSciResearch)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          if (data) {
            this.sciResearch = data;
            this.snackBar.open('更新成功', '关闭', { duration: 2000 });
          } else {
            this.snackBar.open('更新失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('更新失败', '关闭', { duration: 2000 });
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.sciResearchService.getSciResearch(params['id']).
        pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
            if (data) {
              this.sciResearch = data;
              this.sciResearchForm = new FormGroup({
                number: new FormControl(this.sciResearch.number || '', [Validators.required]),
                title: new FormControl(this.sciResearch.title || '', [Validators.required]),
                teachersIn: new FormArray([]),
                teachersOut: new FormArray([]),
                startDate: new FormControl(this.sciResearch.startDate || null),
                duration: new FormControl(this.sciResearch.duration || ''),
                level: new FormControl(this.sciResearch.level || ''),
                rank: new FormControl(this.sciResearch.rank || ''),
                achievement: new FormControl(this.sciResearch.achievement || ''),
                fund: new FormControl(this.sciResearch.fund || ''),
                awardRecords: new FormArray([]),
              });

              if (this.sciResearch.teachersIn) {
                this.sciResearch.teachersIn.forEach(teacher => {
                  (this.sciResearchForm.get('teachersIn') as FormArray).push(new FormControl(teacher));
                });
              }

              if (this.sciResearch.teachersOut) {
                this.sciResearch.teachersOut.forEach(teacher => {
                  (this.sciResearchForm.get('teachersOut') as FormArray).push(new FormControl(teacher));
                });
              }

              if (this.sciResearch.awards) {
                this.sciResearch.awards.forEach(awardRecord => {
                  (this.sciResearchForm.get('awardRecords') as FormArray).push(new FormGroup({
                    awardName: new FormControl(awardRecord.awardName || '', [Validators.required]),
                    awardLevel: new FormControl(awardRecord.awardLevel || ''),
                    awardDate: new FormControl(awardRecord.awardDate || null),
                    awardRank: new FormControl(awardRecord.awardRank || ''),
                  }));
                });
              }

              this.snackBar.open('获取数据成功', '关闭', { duration: 2000 });
            } else {
              this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
            }
          },
          error: (error) => {
            console.log(error);
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
      next: (data) => {
        if (data) {
          this.teachersInOptions = data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
