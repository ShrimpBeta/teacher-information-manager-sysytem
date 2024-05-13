import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PasswordService } from '../../../services/password.service';
import { Subject, takeUntil } from 'rxjs';
import { EditPassword } from '../../../models/models/password.model';

@Component({
  selector: 'app-previewpassword',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './previewpassword.component.html',
  styleUrl: './previewpassword.component.scss'
})
export class PreviewpasswordComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private snackBar: MatSnackBar,
    private passwordService: PasswordService
  ) { }

  progressing = false;
  file: File | null = null;
  newPasswordList: EditPassword[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      if (this.fileTypeCheck(input.files[0])) {
        this.file = input.files[0];
      } else {
        this.snackBar.open('文件格式错误', '关闭', { duration: 2000 })
      }
    }
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
          console.log(datas);
          this.file = null;
          this.progressing = false;
        },
        error: (error) => {
          console.log(error);
          this.progressing = false;
          this.snackBar.open('解析失败或上传失败', '关闭', { duration: 2000 });
        }
      });
    }
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
