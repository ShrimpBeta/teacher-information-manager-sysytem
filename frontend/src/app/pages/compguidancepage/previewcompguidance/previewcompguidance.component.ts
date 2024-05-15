import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompGuidanceService } from '../../../services/compguidance.service';
import { Subject, takeUntil } from 'rxjs';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { EditCompGuidance, PreviewCompGuidance } from '../../../models/models/compGuidance.model';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';
import { MatDividerModule } from '@angular/material/divider';
import { CompguidanceformComponent } from '../../../components/compguidanceform/compguidanceform.component';

@Component({
  selector: 'app-previewcompguidance',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MatProgressSpinnerModule,
    MatDividerModule, CompguidanceformComponent],
  templateUrl: './previewcompguidance.component.html',
  styleUrl: './previewcompguidance.component.scss'
})
export class PreviewcompguidanceComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  compGuidanceForm!: FormGroup;
  newCompGuidanceList: PreviewCompGuidance[] = [];
  index: number = 0;
  buttonLabel: string = '创建';

  constructor(
    private snackBar: MatSnackBar,
    private compGuidanceService: CompGuidanceService
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
      this.compGuidanceService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newCompGuidanceList = datas;
            if (datas.length > 0) {
              this.generateCompguidanceForm();
            }
          }
        },
        error: (error) => {
          console.log(error);
          this.progressing = false;
          this.snackBar.open('上传失败或解析失败', '关闭', { duration: 2000 });
        }
      });
    }
  }

  createCompguidance() {
    console.log(this.compGuidanceForm.value);

    let newCompguidance = new EditCompGuidance();
    newCompguidance.projectName = this.compGuidanceForm.get('projectName')?.value;
    newCompguidance.competitionScore = this.compGuidanceForm.get('competitionScore')?.value;
    newCompguidance.awardStatus = this.compGuidanceForm.get('awardStatus')?.value;
    newCompguidance.guidanceDate = this.compGuidanceForm.get('guidanceDate')?.value;

    let studentNamesControlArray = this.compGuidanceForm.get('studentNames') as FormArray;
    if (studentNamesControlArray && studentNamesControlArray.length > 0) {
      newCompguidance.studentNames = studentNamesControlArray.controls.map((control) => control.value);
    }

    console.log(newCompguidance);

    this.compGuidanceService.createCompGuidance(newCompguidance).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          this.newCompGuidanceList.splice(this.index, 1);
          if (this.index > this.newCompGuidanceList.length - 1 && this.newCompGuidanceList.length > 0) {
            this.index = this.newCompGuidanceList.length - 1;
          }

          if (this.newCompGuidanceList.length > 0) {
            this.generateCompguidanceForm();
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

  onPrevious() {
    if (this.index > 0) {
      this.index--;
      this.generateCompguidanceForm();
    }
  }

  onNext() {
    if (this.index < this.newCompGuidanceList.length - 1) {
      this.index++;
      this.generateCompguidanceForm();
    }
  }

  generateCompguidanceForm() {
    this.compGuidanceForm = new FormGroup({
      projectName: new FormControl(this.newCompGuidanceList[this.index].projectName || '', [Validators.required]),
      studentNames: new FormArray([], [ArrayEmptyValidator()]),
      competitionScore: new FormControl(this.newCompGuidanceList[this.index].competitionScore || ''),
      guidanceDate: new FormControl(this.newCompGuidanceList[this.index].guidanceDate || new Date(), [Validators.required]),
      awardStatus: new FormControl(this.newCompGuidanceList[this.index].awardStatus || ''),
    });

    if (this.newCompGuidanceList[this.index].studentNames.length > 0) {
      this.newCompGuidanceList[this.index].studentNames.forEach((studentName) => {
        (this.compGuidanceForm.get('studentNames') as FormArray).push(new FormControl(studentName, [Validators.required]));
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
