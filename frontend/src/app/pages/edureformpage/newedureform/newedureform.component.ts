import { Component, OnDestroy, OnInit } from '@angular/core';
import { EdureformformComponent } from '../../../components/edureformform/edureformform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../../services/user.service';
import { UserExport } from '../../../models/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { EditEduReform } from '../../../models/models/eduReform.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EduReformService } from '../../../services/edureform.service';

@Component({
  selector: 'app-newedureform',
  standalone: true,
  imports: [EdureformformComponent, MatDividerModule],
  templateUrl: './newedureform.component.html',
  styleUrl: './newedureform.component.scss'
})
export class NewedureformComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  eduReformForm!: FormGroup;
  teachersInOptions: UserExport[] = [];
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private eduReformService: EduReformService
  ) {

  }

  createEduReform() {
    console.log(this.eduReformForm.value);

    let newEduReform = new EditEduReform();
    newEduReform.title = this.eduReformForm.get('title')?.value;
    newEduReform.number = this.eduReformForm.get('number')?.value;
    newEduReform.startDate = this.eduReformForm.get('startDate')?.value;
    newEduReform.duration = this.eduReformForm.get('duration')?.value;
    newEduReform.level = this.eduReformForm.get('level')?.value;
    newEduReform.rank = this.eduReformForm.get('rank')?.value;
    newEduReform.achievement = this.eduReformForm.get('achievement')?.value;
    newEduReform.fund = this.eduReformForm.get('fund')?.value;

    let teachersInControlArray = this.eduReformForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newEduReform.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }

    let teachersOutControlArray = this.eduReformForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newEduReform.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    console.log(newEduReform);
    this.eduReformService.createEduReform(newEduReform)
      .pipe(takeUntil(this.$destroy)).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open('创建成功', '关闭', {
              duration: 2000,
            });
            this.router.navigate(['/main/educationreform']);
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
    this.eduReformForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      startDate: new FormControl(null),
      duration: new FormControl(''),
      level: new FormControl(''),
      rank: new FormControl(''),
      achievement: new FormControl(''),
      fund: new FormControl(''),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (res) => {
        this.teachersInOptions = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }

}
