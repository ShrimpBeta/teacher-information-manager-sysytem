import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompguidanceformComponent } from '../../../components/compguidanceform/compguidanceform.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompGuidanceService } from '../../../services/compguidance.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditCompGuidance } from '../../../models/models/compGuidance.model';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';

@Component({
  selector: 'app-newcompguidance',
  standalone: true,
  imports: [CompguidanceformComponent, MatDividerModule],
  templateUrl: './newcompguidance.component.html',
  styleUrl: './newcompguidance.component.scss'
})
export class NewcompguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '创建';
  compGuidanceForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  constructor(
    private compGuidanceService: CompGuidanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  createCompguidance() {
    console.log(this.compGuidanceForm.value);

    let newCompguidance = new EditCompGuidance();
    newCompguidance.projectName = this.compGuidanceForm.get('projectName')?.value;
    newCompguidance.competitionScore = this.compGuidanceForm.get('competitionScore')?.value;
    newCompguidance.awardStatus = this.compGuidanceForm.get('awardStatus')?.value;
    newCompguidance.guidanceDate = this.compGuidanceForm.get('guidanceDate')?.value;

    let studentNamesControlArray = this.compGuidanceForm.get('studentNames') as FormArray;
    if (studentNamesControlArray && studentNamesControlArray.length > 0) {
      newCompguidance.studentNames = studentNamesControlArray.controls.map((control) => control.value);
    }

    console.log(newCompguidance);

    this.compGuidanceService.createCompGuidance(newCompguidance).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('创建成功', '关闭', {
            duration: 2000,
          });
          this.router.navigate(['/main/competitionguidance']);
        } else {
          this.snackBar.open('创建失败', '关闭', {
            duration: 2000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open('创建失败', '关闭', {
          duration: 2000,
        });
        console.error(error);
      }
    });
  }

  ngOnInit(): void {
    this.compGuidanceForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      studentNames: new FormArray([], [ArrayEmptyValidator()]),
      competitionScore: new FormControl(''),
      guidanceDate: new FormControl(new Date(), [Validators.required]),
      awardStatus: new FormControl(''),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
