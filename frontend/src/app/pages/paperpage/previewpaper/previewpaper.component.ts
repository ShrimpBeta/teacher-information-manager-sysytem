import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { EditPaper, PreviewPaper } from '../../../models/models/paper.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserExport } from '../../../models/models/user.model';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { PaperService } from '../../../services/paper.service';
import { UserService } from '../../../services/user.service';
import { MatDividerModule } from '@angular/material/divider';
import { PaperformComponent } from '../../../components/paperform/paperform.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-previewpaper',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, PaperformComponent, MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './previewpaper.component.html',
  styleUrl: './previewpaper.component.scss'
})
export class PreviewpaperComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  paperForm!: FormGroup;
  newPaperList: PreviewPaper[] = [];
  index: number = 0;
  buttonLabel: string = '创建';
  userId!: string;
  teachersInOptions: UserExport[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private paperService: PaperService,
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
      this.paperService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newPaperList = datas;
            this.index = 0;
            if (datas.length > 0) {
              this.generatePaperForm();
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

  createPaper(): void {
    console.log(this.paperForm.value);
    let newPaper = new EditPaper();

    newPaper.title = this.paperForm.get('title')?.value;
    newPaper.rank = this.paperForm.get('rank')?.value;
    newPaper.journalName = this.paperForm.get('journalName')?.value;
    newPaper.journalLevel = this.paperForm.get('journalLevel')?.value;

    let teachersInControlArray = this.paperForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newPaper.teachersIn = teachersInControlArray.controls.map((control) => control.value.id).filter((id) => id !== this.userId);
    }

    let teachersOutControlArray = this.paperForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newPaper.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    if (this.paperForm.get('publishDate')?.value !== '') {
      newPaper.publishDate = new Date(this.paperForm.get('publishDate')?.value);
    }
    console.log(newPaper);

    this.paperService.createPaper(newPaper).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {

          this.newPaperList.splice(this.index, 1);

          if (this.index > this.newPaperList.length - 1 && this.newPaperList.length > 0) {
            this.index = this.newPaperList.length - 1;
          }

          if (this.newPaperList.length > 0) {
            this.generatePaperForm();
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
      }
    });
  }


  onPrevious(): void {
    if (this.index > 0) {
      this.index--;
      this.generatePaperForm();
    }
  }

  onNext(): void {
    if (this.index < this.newPaperList.length - 1) {
      this.index++;
      this.generatePaperForm();
    }
  }

  generatePaperForm() {
    this.paperForm = new FormGroup({
      title: new FormControl(this.newPaperList[this.index].title || '', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(this.newPaperList[this.index].publishDate || new Date(), [Validators.required]),
      rank: new FormControl(this.newPaperList[this.index].rank || ''),
      journalName: new FormControl(this.newPaperList[this.index].journalName || ''),
      journalLevel: new FormControl(this.newPaperList[this.index].journalLevel || ''),
    });

    if (this.newPaperList[this.index].teachersIn && this.newPaperList[this.index].teachersIn.length > 0) {
      let teachersInControlArray = this.paperForm.get('teachersIn') as FormArray;
      this.newPaperList[this.index].teachersIn.forEach((teacher) => {
        teachersInControlArray.push(new FormControl(teacher));
      });
    }

    if (this.newPaperList[this.index].teachersOut && this.newPaperList[this.index].teachersOut!.length > 0) {
      let teachersOutControlArray = this.paperForm.get('teachersOut') as FormArray;
      this.newPaperList[this.index].teachersOut!.forEach((teacher) => {
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
