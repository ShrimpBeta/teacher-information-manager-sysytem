import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { PaperformComponent } from '../../../components/paperform/paperform.component';
import { PaperService } from '../../../services/paper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditPaper } from '../../../models/models/paper.model';

@Component({
  selector: 'app-newpaper',
  standalone: true,
  imports: [PaperformComponent, MatDividerModule],
  templateUrl: './newpaper.component.html',
  styleUrl: './newpaper.component.scss'
})
export class NewpaperComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  paperForm!: FormGroup;
  teachersInOptions: UserExport[] = [];
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private paperService: PaperService
  ) {

  }

  createPaper(): void {
    console.log(this.paperForm.value);
    let newPaper = new EditPaper();

    newPaper.title = this.paperForm.get('title')?.value;
    newPaper.rank = this.paperForm.get('rank')?.value;
    newPaper.journalName = this.paperForm.get('journalName')?.value;
    newPaper.journalLevel = this.paperForm.get('journalLevel')?.value;

    let teachersInControlArray = this.paperForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newPaper.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }

    let teachersOutControlArray = this.paperForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newPaper.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    if (this.paperForm.get('publishDate')?.value !== '') {
      newPaper.publishDate = new Date(this.paperForm.get('publishDate')?.value);
    }
    console.log(newPaper);

    this.paperService.createPaper(newPaper).pipe(takeUntil(this.$destroy)).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('创建成功', '关闭', {
            duration: 2000,
          });
          this.router.navigate(['/main/paper']);
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
      }
    });
  }

  ngOnInit(): void {
    this.paperForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(new Date(), [Validators.required]),
      rank: new FormControl(''),
      journalName: new FormControl(''),
      journalLevel: new FormControl(''),
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

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
