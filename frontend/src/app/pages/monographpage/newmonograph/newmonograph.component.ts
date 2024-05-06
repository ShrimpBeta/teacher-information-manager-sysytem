import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonographformComponent } from '../../../components/monographform/monographform.component';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MonographService } from '../../../services/monograph.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditMonograph } from '../../../models/models/monograph.model';

@Component({
  selector: 'app-newmonograph',
  standalone: true,
  imports: [MonographformComponent, MatDividerModule],
  templateUrl: './newmonograph.component.html',
  styleUrl: './newmonograph.component.scss'
})
export class NewmonographComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  monographForm!: FormGroup;
  teachersInOptions: UserExport[] = [];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private monographService: MonographService
  ) {
  }

  createMonograph() {
    console.log(this.monographForm.value);
    let newMonograph = new EditMonograph();
    newMonograph.title = this.monographForm.get('title')?.value;
    newMonograph.publishLevel = this.monographForm.get('publishLevel')?.value;
    newMonograph.rank = this.monographForm.get('rank')?.value;
    newMonograph.publishDate = this.monographForm.get('publishDate')?.value;

    let teachersInControlArray = this.monographForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newMonograph.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }

    let teachersOutControlArray = this.monographForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newMonograph.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    console.log(newMonograph);

    this.monographService.createMonograph(newMonograph).pipe(takeUntil(this.$destroy)).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('创建成功', '关闭', {
            duration: 2000,
          });
          this.router.navigate(['/main/monograph']);
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
    this.monographForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(new Date(), [Validators.required]),
      publishLevel: new FormControl(''),
      rank: new FormControl(''),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (userExports) => {
        this.teachersInOptions = userExports;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
