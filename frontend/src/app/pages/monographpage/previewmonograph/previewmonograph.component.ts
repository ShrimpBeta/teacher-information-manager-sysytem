import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MonographService } from '../../../services/monograph.service';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EditMonograph, PreviewMonograph } from '../../../models/models/monograph.model';
import { UserExport } from '../../../models/models/user.model';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { UserService } from '../../../services/user.service';
import { MonographformComponent } from '../../../components/monographform/monographform.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-previewmonograph',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MonographformComponent,
    MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './previewmonograph.component.html',
  styleUrl: './previewmonograph.component.scss'
})
export class PreviewmonographComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  monographForm!: FormGroup;
  newMonographList: PreviewMonograph[] = []
  index: number = 0;
  buttonLabel: string = '创建';
  userId!: string;
  teachersInOptions: UserExport[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private monographService: MonographService,
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

  onUpload() {
    if (this.file) {
      this.progressing = true;
      this.monographService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newMonographList = datas;
            this.index = 0;
            if (datas.length > 0) {
              this.generateMonographForm();
            }
          }
        },
        error: (error) => {
          console.error(error);
          this.progressing = false;
          this.snackBar.open('上传失败或解析失败', '关闭', {
            duration: 2000,
          });
        }
      });
    }
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

    this.monographService.createMonograph(newMonograph).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {

          this.newMonographList.splice(this.index, 1);

          if (this.index > this.newMonographList.length - 1 && this.newMonographList.length > 0) {
            this.index = this.newMonographList.length - 1;
          }

          if (this.newMonographList.length > 0) {
            this.generateMonographForm();
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
        console.error(error);
        this.snackBar.open('创建失败', '关闭', {
          duration: 2000,
        });
      }
    });
  }


  onPrevious() {
    if (this.index > 0) {
      this.index--;
      this.generateMonographForm();
    }
  }

  onNext() {
    if (this.index < this.newMonographList.length - 1) {
      this.index++;
      this.generateMonographForm();
    }
  }

  generateMonographForm() {
    this.monographForm = new FormGroup({
      title: new FormControl(this.newMonographList[this.index].title || '', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(this.newMonographList[this.index].publishDate || new Date(), [Validators.required]),
      publishLevel: new FormControl(this.newMonographList[this.index].publishLevel || ''),
      rank: new FormControl(this.newMonographList[this.index].rank || ''),
    });

    if (this.newMonographList[this.index].teachersIn && this.newMonographList[this.index].teachersIn.length > 0) {
      let teachersInControlArray = this.monographForm.get('teachersIn') as FormArray;
      this.newMonographList[this.index].teachersIn.forEach((teacher) => {
        teachersInControlArray.push(new FormControl(teacher));
      });
    }

    if (this.newMonographList[this.index].teachersOut && this.newMonographList[this.index].teachersOut!.length > 0) {
      let teachersOutControlArray = this.monographForm.get('teachersOut') as FormArray;
      this.newMonographList[this.index].teachersOut!.forEach((teacher) => {
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
