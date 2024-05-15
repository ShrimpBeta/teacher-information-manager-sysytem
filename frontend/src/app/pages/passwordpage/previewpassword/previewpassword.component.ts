import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { PasswordformComponent } from '../../../components/passwordform/passwordform.component';
import { PasswordService } from '../../../services/password.service';
import { Subject, takeUntil } from 'rxjs';
import { EditPassword } from '../../../models/models/password.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { URLValidator } from '../../../shared/formvalidator/url.validator';

@Component({
  selector: 'app-previewpassword',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MatProgressSpinnerModule,
    PasswordformComponent, MatDividerModule
  ],
  templateUrl: './previewpassword.component.html',
  styleUrl: './previewpassword.component.scss'
})
export class PreviewpasswordComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  passwordForm!: FormGroup;
  newPasswordList: EditPassword[] = [];
  index: number = 0;
  buttonLabel: string = '创建';

  constructor(
    private snackBar: MatSnackBar,
    private passwordService: PasswordService
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
      this.passwordService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newPasswordList = datas
            if (datas.length > 0) {
              this.passwordForm = new FormGroup({
                url: new FormControl(datas[0].url || '', [URLValidator()]),
                appName: new FormControl(datas[0].appName || ''),
                account: new FormControl(datas[0].account || '', [Validators.required]),
                password: new FormControl(datas[0].password || '', [Validators.required]),
                description: new FormControl(datas[0].description || '')
              });
            }
          }
        },
        error: (error) => {
          console.log(error);
          this.progressing = false;
          this.snackBar.open('解析失败或上传失败', '关闭', { duration: 2000 });
        }
      });
    }
  }

  onPrevious() {
    if (this.index > 0) {
      this.index--;
      this.passwordForm = new FormGroup({
        url: new FormControl(this.newPasswordList[this.index].url || '', [URLValidator()]),
        appName: new FormControl(this.newPasswordList[this.index].appName || ''),
        account: new FormControl(this.newPasswordList[this.index].account || '', [Validators.required]),
        password: new FormControl(this.newPasswordList[this.index].password || '', [Validators.required]),
        description: new FormControl(this.newPasswordList[this.index].description || '')
      });
    }
  }

  onNext() {
    if (this.index < this.newPasswordList.length - 1) {
      this.index++;
      this.passwordForm = new FormGroup({
        url: new FormControl(this.newPasswordList[this.index].url || '', [URLValidator()]),
        appName: new FormControl(this.newPasswordList[this.index].appName || ''),
        account: new FormControl(this.newPasswordList[this.index].account || '', [Validators.required]),
        password: new FormControl(this.newPasswordList[this.index].password || '', [Validators.required]),
        description: new FormControl(this.newPasswordList[this.index].description || '')
      });
    }
  }

  createPassword(event: any) {

    this.passwordService.createPassword(this.passwordForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (password) => {
            if (password) {
              // remove the password from the list
              this.newPasswordList.splice(this.index, 1);
              // reset the form
              if (this.index > this.newPasswordList.length - 1 && this.newPasswordList.length > 0) {
                this.index = this.newPasswordList.length - 1;
              }

              if (this.newPasswordList.length > 0) {
                this.passwordForm = new FormGroup({
                  url: new FormControl(this.newPasswordList[this.index].url || '', [URLValidator()]),
                  appName: new FormControl(this.newPasswordList[this.index].appName || ''),
                  account: new FormControl(this.newPasswordList[this.index].account || '', [Validators.required]),
                  password: new FormControl(this.newPasswordList[this.index].password || '', [Validators.required]),
                  description: new FormControl(this.newPasswordList[this.index].description || '')
                });
              }

              this.snackBar.open('创建密码成功', '关闭', { duration: 3000 });

            } else {
              this.snackBar.open('创建密码失败', '关闭', { duration: 3000 });
            }
          },
          error: (error) => {
            this.snackBar.open('创建密码失败', '关闭', { duration: 3000 });
          }
        })
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
