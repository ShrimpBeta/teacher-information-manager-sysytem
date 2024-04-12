import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CompguidanceformComponent } from '../../../components/compguidanceform/compguidanceform.component';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';
import { ActivatedRoute } from '@angular/router';
import { CompGuidanceService } from '../../../services/compguidance.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompGuidance, EditCompGuidance } from '../../../models/models/compGuidance.model';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editcompguidance',
  standalone: true,
  imports: [CompguidanceformComponent, MatDividerModule, DatePipe],
  templateUrl: './editcompguidance.component.html',
  styleUrl: './editcompguidance.component.scss'
})
export class EditcompguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  compGuidanceForm!: FormGroup;
  compGuidance!: CompGuidance;
  private destroy$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private compGuidanceService: CompGuidanceService,
    private snackBar: MatSnackBar,
  ) { }


  updateCompguidance() {
    console.log(this.compGuidanceForm.value);

    let updateCompguidance = new EditCompGuidance();
    updateCompguidance.projectName = this.compGuidanceForm.get('projectName')?.value;
    updateCompguidance.competitionScore = this.compGuidanceForm.get('competitionScore')?.value;
    updateCompguidance.awardStatus = this.compGuidanceForm.get('awardStatus')?.value;
    updateCompguidance.guidanceDate = this.compGuidanceForm.get('guidanceDate')?.value;

    let studentNamesControlArray = this.compGuidanceForm.get('studentNames') as FormArray;
    if (studentNamesControlArray && studentNamesControlArray.length > 0) {
      updateCompguidance.studentNames = studentNamesControlArray.controls.map((control) => control.value);
    }

    console.log(updateCompguidance);

    this.compGuidanceService.updateCompGuidance(this.compGuidance.id, updateCompguidance)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (compGuidance) => {
          if (compGuidance) {
            this.compGuidance = compGuidance;
            this.snackBar.open('更新比赛指导成功', '关闭', { duration: 3000 });
          } else {
            this.snackBar.open('更新比赛指导失败', '关闭', { duration: 3000 });
          }
        },
        error: (error: unknown) => {
          this.snackBar.open('更新比赛指导失败', '关闭', { duration: 3000 });
        }
      });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.compGuidanceService.getCompGuidance(params['id'])
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (compGuidance) => {
            if (compGuidance) {
              this.compGuidance = compGuidance;

              this.compGuidanceForm = new FormGroup({
                projectName: new FormControl(this.compGuidance?.projectName || '', [Validators.required]),
                studentNames: new FormArray([], [ArrayEmptyValidator()]),
                competitionScore: new FormControl(this.compGuidance?.competitionScore || ''),
                guidanceDate: new FormControl(this.compGuidance?.guidanceDate || null),
                awardStatus: new FormControl(this.compGuidance?.awardStatus || ''),
              });

              if (this.compGuidance.studentNames) {
                this.compGuidance.studentNames.forEach(studentName => {
                  (this.compGuidanceForm.get('studentNames') as FormArray).push(new FormControl(studentName));
                });
              }

              this.snackBar.open('获取比赛指导成功', '关闭', { duration: 3000 });
            } else {
              this.snackBar.open('获取比赛指导失败', '关闭', { duration: 3000 });
            }
          },
          error: (error: unknown) => {
            this.snackBar.open('获取比赛指导失败', '关闭', { duration: 3000 });
          }

        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
