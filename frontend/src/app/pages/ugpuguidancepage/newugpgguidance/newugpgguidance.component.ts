import { Component, OnDestroy, OnInit } from '@angular/core';
import { UgpgguidanceformComponent } from '../../../components/ugpgguidanceform/ugpgguidanceform.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';
import { EditUGPGGuidance } from '../../../models/models/uGPGGuidance.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-newugpgguidance',
  standalone: true,
  imports: [MatDividerModule, UgpgguidanceformComponent],
  templateUrl: './newugpgguidance.component.html',
  styleUrl: './newugpgguidance.component.scss'
})
export class NewugpgguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '创建';
  ugpgGuidanceForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  constructor(
    private ugpgGuidanceService: UGPGGuidanceService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  createUgpgGuidance() {
    console.log(this.ugpgGuidanceForm.value);

    let newUgpgGuidance = new EditUGPGGuidance();
    newUgpgGuidance.studentName = this.ugpgGuidanceForm.get('studentName')?.value;
    newUgpgGuidance.thesisTopic = this.ugpgGuidanceForm.get('thesisTopic')?.value;
    newUgpgGuidance.openingCheckResult = this.ugpgGuidanceForm.get('openingCheckResult')?.value;
    newUgpgGuidance.midtermCheckResult = this.ugpgGuidanceForm.get('midtermCheckResult')?.value;
    newUgpgGuidance.defenseResult = this.ugpgGuidanceForm.get('defenseResult')?.value;
    newUgpgGuidance.openingCheckDate = this.ugpgGuidanceForm.get('openingCheckDate')?.value;
    newUgpgGuidance.midtermCheckDate = this.ugpgGuidanceForm.get('midtermCheckDate')?.value;
    newUgpgGuidance.defenseDate = this.ugpgGuidanceForm.get('defenseDate')?.value;

    console.log(newUgpgGuidance);

    this.ugpgGuidanceService.createUGPGGuidance(newUgpgGuidance).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('创建成功', '关闭', {
            duration: 2000,
          });
          this.router.navigate(['/main/ugpgguidance']);
        } else {
          this.snackBar.open('创建失败', '关闭', {
            duration: 2000,
          });
        }
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('创建失败', '关闭', {
          duration: 2000,
        });
      }
    });
  }

  ngOnInit(): void {
    this.ugpgGuidanceForm = new FormGroup({
      studentName: new FormControl('', [Validators.required]),
      thesisTopic: new FormControl('', [Validators.required]),
      openingCheckDate: new FormControl(null),
      openingCheckResult: new FormControl(''),
      midtermCheckDate: new FormControl(null),
      midtermCheckResult: new FormControl(''),
      defenseDate: new FormControl(null, [Validators.required]),
      defenseResult: new FormControl('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {

  }
}
