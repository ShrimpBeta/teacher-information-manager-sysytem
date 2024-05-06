import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UgpgguidanceformComponent } from '../../../components/ugpgguidanceform/ugpgguidanceform.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditUGPGGuidance, UGPGGuidance } from '../../../models/models/uGPGGuidance.model';
import { Subject, takeUntil } from 'rxjs';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editugpgguidance',
  standalone: true,
  imports: [UgpgguidanceformComponent, MatDividerModule, DatePipe],
  templateUrl: './editugpgguidance.component.html',
  styleUrl: './editugpgguidance.component.scss'
})
export class EditugpgguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  uGPGGuidanceForm!: FormGroup;
  uGPGGuidance!: UGPGGuidance;
  private destroy$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private uGPGGuidanceService: UGPGGuidanceService,
    private snackBar: MatSnackBar
  ) {

  }

  updateUGPGGuidance(): void {
    console.log(this.uGPGGuidanceForm.value)

    let updateUGPGGuidance = new EditUGPGGuidance();
    updateUGPGGuidance.studentName = this.uGPGGuidanceForm.get('studentName')?.value;
    updateUGPGGuidance.thesisTopic = this.uGPGGuidanceForm.get('thesisTopic')?.value;
    updateUGPGGuidance.openingCheckResult = this.uGPGGuidanceForm.get('openingCheckResult')?.value;
    updateUGPGGuidance.openingCheckDate = this.uGPGGuidanceForm.get('openingCheckDate')?.value;
    updateUGPGGuidance.midtermCheckResult = this.uGPGGuidanceForm.get('midtermCheckResult')?.value;
    updateUGPGGuidance.midtermCheckDate = this.uGPGGuidanceForm.get('midtermCheckDate')?.value;
    updateUGPGGuidance.defenseResult = this.uGPGGuidanceForm.get('defenseResult')?.value;
    updateUGPGGuidance.defenseDate = this.uGPGGuidanceForm.get('defenseDate')?.value;

    console.log(updateUGPGGuidance)

    this.uGPGGuidanceService.updateUGPGGuidance(this.uGPGGuidance.id, updateUGPGGuidance)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          if (data) {
            this.uGPGGuidance = data;
            this.snackBar.open('更新毕设指导成功', '关闭', {
              duration: 2000
            });
          } else {
            this.snackBar.open('更新毕设指导失败', '关闭', {
              duration: 2000
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.snackBar.open('更新毕设指导失败', '关闭', {
            duration: 2000
          });
        }

      });
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.uGPGGuidanceService.getUGPGGuidance(params['id'])
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (data) => {
            if (data) {
              this.uGPGGuidance = data;
              this.uGPGGuidanceForm = new FormGroup({
                studentName: new FormControl(this.uGPGGuidance.studentName, [Validators.required]),
                thesisTopic: new FormControl(this.uGPGGuidance.thesisTopic, [Validators.required]),
                openingCheckResult: new FormControl(this.uGPGGuidance.openingCheckResult || '',),
                openingCheckDate: new FormControl(this.uGPGGuidance.openingCheckDate || null,),
                midtermCheckResult: new FormControl(this.uGPGGuidance.midtermCheckResult || '',),
                midtermCheckDate: new FormControl(this.uGPGGuidance.midtermCheckDate || null,),
                defenseResult: new FormControl(this.uGPGGuidance.defenseResult, [Validators.required]),
                defenseDate: new FormControl(this.uGPGGuidance.defenseDate, [Validators.required]),
              });

              this.snackBar.open('获取毕设指导成功', '关闭', { duration: 2000 });
            } else {
              this.snackBar.open('获取毕设指导失败', '关闭', { duration: 2000 });
            }
          },
          error: (error) => {
            console.log(error);
            this.snackBar.open('获取毕设指导失败', '关闭', { duration: 2000 });
          }

        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
