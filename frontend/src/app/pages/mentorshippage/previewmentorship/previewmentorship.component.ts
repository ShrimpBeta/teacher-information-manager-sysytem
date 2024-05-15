import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MentorshipService } from '../../../services/mentorship.service';
import { Subject } from 'rxjs';
import { EditMentorship } from '../../../models/models/mentorship.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';
import { MentorshipformComponent } from '../../../components/mentorshipform/mentorshipform.component';

@Component({
  selector: 'app-previewmentorship',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MatDividerModule,
    MatProgressSpinnerModule, MentorshipformComponent
  ],
  templateUrl: './previewmentorship.component.html',
  styleUrl: './previewmentorship.component.scss'
})
export class PreviewmentorshipComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  mentorshipForm!: FormGroup;
  newMentorshipList: EditMentorship[] = [];
  index: number = 0;
  buttonLabel: string = '创建';

  constructor(
    private snackBar: MatSnackBar,
    private mentorshipService: MentorshipService,
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
      this.mentorshipService.uploadFile(this.file).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.progressing = false;
            this.file = null;
            this.newMentorshipList = datas;
            if (datas.length > 0) {
              this.mentorshipForm = new FormGroup({
                projectName: new FormControl(datas[0].projectName || '', [Validators.required]),
                grade: new FormControl(datas[0].grade || null),
                guidanceDate: new FormControl(datas[0].guidanceDate || new Date(), [Validators.required]),
                studentNames: new FormArray([], [ArrayEmptyValidator()])
              });
              let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
              datas[0].studentNames.forEach((studentName) => {
                studentNamesControlArray.push(new FormControl(studentName));
              });
            }
          }

        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('上传失败或解析失败', '关闭', {
            duration: 2000,
          });
          this.progressing = false;
        }
      });
    }
  }

  createMentorship() {
    console.log(this.mentorshipForm.value);
    let newMentorship = new EditMentorship();
    newMentorship.projectName = this.mentorshipForm.get('projectName')?.value;
    newMentorship.grade = this.mentorshipForm.get('grade')?.value;
    newMentorship.guidanceDate = new Date(this.mentorshipForm.get('guidanceDate')?.value);

    let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
    if (studentNamesControlArray && studentNamesControlArray.length > 0) {
      newMentorship.studentNames = studentNamesControlArray.controls.map((control) => control.value);
    }

    console.log(newMentorship);

    this.mentorshipService.createMentorship(newMentorship).subscribe({
      next: (response) => {
        if (response) {

          this.newMentorshipList.splice(this.index, 1);

          if (this.index > this.newMentorshipList.length - 1 && this.newMentorshipList.length > 0) {
            this.index = this.newMentorshipList.length - 1;
          }

          if(this.newMentorshipList.length > 0) {
            this.mentorshipForm = new FormGroup({
              projectName: new FormControl(this.newMentorshipList[this.index].projectName || '', [Validators.required]),
              grade: new FormControl(this.newMentorshipList[this.index].grade || null),
              guidanceDate: new FormControl(this.newMentorshipList[this.index].guidanceDate || new Date(), [Validators.required]),
              studentNames: new FormArray([], [ArrayEmptyValidator()])
            });
            let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
            this.newMentorshipList[this.index].studentNames.forEach((studentName) => {
              studentNamesControlArray.push(new FormControl(studentName));
            });
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

      this.mentorshipForm = new FormGroup({
        projectName: new FormControl(this.newMentorshipList[this.index].projectName || '', [Validators.required]),
        grade: new FormControl(this.newMentorshipList[this.index].grade || null),
        guidanceDate: new FormControl(this.newMentorshipList[this.index].guidanceDate || new Date(), [Validators.required]),
        studentNames: new FormArray([], [ArrayEmptyValidator()])
      });
      let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
      this.newMentorshipList[this.index].studentNames.forEach((studentName) => {
        studentNamesControlArray.push(new FormControl(studentName));
      });
    }
  }

  onNext() {
    if (this.index < this.newMentorshipList.length - 1) {
      this.index++;

      this.mentorshipForm = new FormGroup({
        projectName: new FormControl(this.newMentorshipList[this.index].projectName || '', [Validators.required]),
        grade: new FormControl(this.newMentorshipList[this.index].grade || null),
        guidanceDate: new FormControl(this.newMentorshipList[this.index].guidanceDate || new Date(), [Validators.required]),
        studentNames: new FormArray([], [ArrayEmptyValidator()])
      });
      let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
      this.newMentorshipList[this.index].studentNames.forEach((studentName) => {
        studentNamesControlArray.push(new FormControl(studentName));
      });

    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
