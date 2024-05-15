import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { EditUGPGGuidance } from '../../../models/models/uGPGGuidance.model';
import { UGPGGuidanceService } from '../../../services/ugpgguidance.service';

@Component({
  selector: 'app-previewugpgguidance',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule],
  templateUrl: './previewugpgguidance.component.html',
  styleUrl: './previewugpgguidance.component.scss'
})
export class PreviewugpgguidanceComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  ugpgGuidanceForm!: FormGroup;
  newUGPGGuidanceList: EditUGPGGuidance[] = [];
  index: number = 0;
  buttonLabel: string = '创建';
  constructor(
    private snackBar: MatSnackBar,
    private ugpgGuidanceService: UGPGGuidanceService,
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

  // onUpload() {
  //   if (this.file) {
  //     this.progressing = true;
  //     this.ugpgGuidanceService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
  //       next: (datas) => {
  //         if (datas) {
  //           console.log(datas);
  //           this.file = null;
  //           this.newUGPGGuidanceList = datas;
  //           if (datas.length > 0) {
  //             this.ugpgGuidanceForm = new FormGroup({
  //               studentName: new FormControl(this.newUGPGGuidanceList[this.index].studentName || '', [Validators.required]),
  //               thesisTopic: new FormControl(this.newUGPGGuidanceList[this.index].thesisTopic || '', [Validators.required]),
  //               openingCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckDate || null),
  //               openingCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckResult || ''),
  //               midtermCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckDate || null),
  //               midtermCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckResult || ''),
  //               defenseDate: new FormControl(this.newUGPGGuidanceList[this.index].defenseDate || null, [Validators.required]),
  //               defenseResult: new FormControl(this.newUGPGGuidanceList[this.index].defenseResult || '', [Validators.required]),
  //             });
  //           }
  //         }
  //         this.progressing = false;
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         this.snackBar.open('上传失败或解析失败', '关闭', { duration: 2000 });
  //         this.progressing = false;
  //       }
  //     });
  //   }
  // }

  createUgpgGuidance() {
    console.log(this.ugpgGuidanceForm.value);

    let newUgpgGuidance = new EditUGPGGuidance();
    newUgpgGuidance.studentName = this.ugpgGuidanceForm.get('studentName')?.value;
    newUgpgGuidance.thesisTopic = this.ugpgGuidanceForm.get('thesisTopic')?.value;
    newUgpgGuidance.openingCheckResult = this.ugpgGuidanceForm.get('openingCheckResult')?.value;
    newUgpgGuidance.midtermCheckResult = this.ugpgGuidanceForm.get('midtermCheckResult')?.value;
    newUgpgGuidance.defenseResult = this.ugpgGuidanceForm.get('defenseResult')?.value;
    newUgpgGuidance.openingCheckDate = this.ugpgGuidanceForm.get('openingCheckDate')?.value;
    newUgpgGuidance.midtermCheckDate = this.ugpgGuidanceForm.get('midtermCheckDate')?.value;
    newUgpgGuidance.defenseDate = this.ugpgGuidanceForm.get('defenseDate')?.value;

    console.log(newUgpgGuidance);

    this.ugpgGuidanceService.createUGPGGuidance(newUgpgGuidance).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {

          this.newUGPGGuidanceList.splice(this.index, 1);

          if (this.index >= this.newUGPGGuidanceList.length - 1 && this.newUGPGGuidanceList.length > 0) {
            this.index = this.newUGPGGuidanceList.length - 1;
          }

          if (this.newUGPGGuidanceList.length > 0) {
            this.ugpgGuidanceForm = new FormGroup({
              studentName: new FormControl(this.newUGPGGuidanceList[this.index].studentName || '', [Validators.required]),
              thesisTopic: new FormControl(this.newUGPGGuidanceList[this.index].thesisTopic || '', [Validators.required]),
              openingCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckDate || null),
              openingCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckResult || ''),
              midtermCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckDate || null),
              midtermCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckResult || ''),
              defenseDate: new FormControl(this.newUGPGGuidanceList[this.index].defenseDate || null, [Validators.required]),
              defenseResult: new FormControl(this.newUGPGGuidanceList[this.index].defenseResult || '', [Validators.required]),
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
      this.ugpgGuidanceForm = new FormGroup({
        studentName: new FormControl(this.newUGPGGuidanceList[this.index].studentName || '', [Validators.required]),
        thesisTopic: new FormControl(this.newUGPGGuidanceList[this.index].thesisTopic || '', [Validators.required]),
        openingCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckDate || null),
        openingCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckResult || ''),
        midtermCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckDate || null),
        midtermCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckResult || ''),
        defenseDate: new FormControl(this.newUGPGGuidanceList[this.index].defenseDate || null, [Validators.required]),
        defenseResult: new FormControl(this.newUGPGGuidanceList[this.index].defenseResult || '', [Validators.required]),
      });
    }

  }

  onNext() {
    if (this.index < this.newUGPGGuidanceList.length - 1) {
      this.index++;
      this.ugpgGuidanceForm = new FormGroup({
        studentName: new FormControl(this.newUGPGGuidanceList[this.index].studentName || '', [Validators.required]),
        thesisTopic: new FormControl(this.newUGPGGuidanceList[this.index].thesisTopic || '', [Validators.required]),
        openingCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckDate || null),
        openingCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].openingCheckResult || ''),
        midtermCheckDate: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckDate || null),
        midtermCheckResult: new FormControl(this.newUGPGGuidanceList[this.index].midtermCheckResult || ''),
        defenseDate: new FormControl(this.newUGPGGuidanceList[this.index].defenseDate || null, [Validators.required]),
        defenseResult: new FormControl(this.newUGPGGuidanceList[this.index].defenseResult || '', [Validators.required]),
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
function takeUntil(destroy$: Subject<boolean>): any {
  throw new Error('Function not implemented.');
}

