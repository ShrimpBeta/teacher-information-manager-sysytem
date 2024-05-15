import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EduReformService } from '../../../services/edureform.service';
import { generate, Subject, takeUntil } from 'rxjs';
import { EdureformformComponent } from '../../../components/edureformform/edureformform.component';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditEduReform, PreviewEduReform } from '../../../models/models/eduReform.model';
import { AuthRepository } from '../../../core/auth/auth.repository';

@Component({
  selector: 'app-previewedureform',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, EdureformformComponent,
    MatDividerModule, MatProgressSpinnerModule
  ],
  templateUrl: './previewedureform.component.html',
  styleUrl: './previewedureform.component.scss'
})
export class PreviewedureformComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  eduReformForm!: FormGroup;
  newEduReformList: PreviewEduReform[] = [];
  index: number = 0;
  buttonLabel: string = '创建';
  userId!: string;
  teachersInOptions: UserExport[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private eduReformService: EduReformService,
    private userService: UserService,
    private authRepository: AuthRepository,
  ) { }

  progressing = false;
  file: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      if (this.fileTypeCheck(input.files[0])) {
        this.file = input.files[0];
      } else {
        this.snackBar.open('文件格式错误', '关闭', { duration: 2000 })
      }
    }

    input.value = '';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      if (this.fileTypeCheck(files[0])) {
        this.file = files[0];
      } else {
        this.snackBar.open('文件格式错误', '关闭', { duration: 2000 })
      }
    }
  }

  fileTypeCheck(file: File) {
    return (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onPrevious() {
    if (this.index > 0) {
      this.index--;
      this.generateEdureformForm();
    }
  }

  onNext() {
    if (this.index < this.newEduReformList.length - 1) {
      this.index++;
      this.generateEdureformForm();
    }
  }

  onUpload() {
    if (this.file) {
      this.progressing = true;
      this.eduReformService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newEduReformList = datas;
            this.index = 0;
            if (datas.length > 0) {
              this.generateEdureformForm();
            }

            this.snackBar.open('上传成功', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.log(error);
          this.progressing = false;
          this.snackBar.open('上传失败或解析失败', '关闭', { duration: 2000 });
        },
      });
    }
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
      newEduReform.teachersIn = teachersInControlArray.controls.map((control) => control.value.id).filter((id) => id !== this.userId);
    }

    let teachersOutControlArray = this.eduReformForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newEduReform.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    console.log(newEduReform);
    this.eduReformService.createEduReform(newEduReform)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response) {

            this.newEduReformList.splice(this.index, 1);

            if (this.index > this.newEduReformList.length - 1 && this.newEduReformList.length > 0) {
              this.index = this.newEduReformList.length - 1;
            }

            if (this.newEduReformList.length > 0) {
              this.generateEdureformForm();
            }
            this.snackBar.open('创建成功', '关闭', {
              duration: 2000,
            });
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

  generateEdureformForm() {
    this.eduReformForm = new FormGroup({
      number: new FormControl(this.newEduReformList[this.index].number, [Validators.required]),
      title: new FormControl(this.newEduReformList[this.index].title, [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      startDate: new FormControl(this.newEduReformList[this.index].startDate, [Validators.required]),
      duration: new FormControl(this.newEduReformList[this.index].duration || ''),
      level: new FormControl(this.newEduReformList[this.index].level || ''),
      rank: new FormControl(this.newEduReformList[this.index].rank || ''),
      achievement: new FormControl(this.newEduReformList[this.index].achievement || ''),
      fund: new FormControl(this.newEduReformList[this.index].fund || ''),
    });

    if (this.newEduReformList[this.index].teachersIn && this.newEduReformList[this.index].teachersIn.length > 0) {
      let teachersInControlArray = this.eduReformForm.get('teachersIn') as FormArray;
      this.newEduReformList[this.index].teachersIn.forEach((teacher) => {
        teachersInControlArray.push(new FormControl(teacher));
      });
    }

    if (this.newEduReformList[this.index].teachersOut && this.newEduReformList[this.index].teachersOut!.length > 0) {
      let teachersOutControlArray = this.eduReformForm.get('teachersOut') as FormArray;
      this.newEduReformList[this.index].teachersOut!.forEach((teacher) => {
        teachersOutControlArray.push(new FormControl(teacher));
      });
    }
  }

  ngOnInit(): void {
    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user) {
          this.userId = user.id;
        }
      }
    });

    this.userService.userExports().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.teachersInOptions = users;
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
