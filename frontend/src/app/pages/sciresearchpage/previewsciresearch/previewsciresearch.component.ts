import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { EditAwardRecord, EditSciResearch, PreviewSciResearch } from '../../../models/models/sciResearch.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserExport } from '../../../models/models/user.model';
import { SciResearchService } from '../../../services/sciresearch.service';
import { AuthRepository } from '../../../core/auth/auth.repository';
import { UserService } from '../../../services/user.service';
import { SciresearchformComponent } from '../../../components/sciresearchform/sciresearchform.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-previewsciresearch',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule, MatCardModule, MatProgressSpinnerModule,
    SciresearchformComponent, MatDividerModule
  ],
  templateUrl: './previewsciresearch.component.html',
  styleUrl: './previewsciresearch.component.scss'
})
export class PreviewsciresearchComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  sciResearchForm!: FormGroup;
  newSciResearchList: PreviewSciResearch[] = [];
  index: number = 0;
  buttonLabel: string = '创建';
  userId!: string;
  teachersInOptions: UserExport[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private sciResearchService: SciResearchService,
    private authRepository: AuthRepository,
    private userService: UserService
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

      input.value = '';
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
      this.sciResearchService.uploadFile(this.file).pipe(takeUntil(this.destroy$)).subscribe({
        next: (datas) => {
          if (datas) {
            console.log(datas);
            this.file = null;
            this.progressing = false;
            this.newSciResearchList = datas;
            this.index = 0;
            if (datas?.length > 0) {
              this.generateSciResearchForm();
            }
          }
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('上传失败或解析失败', '关闭', { duration: 2000 });
        }
      });
    }
  }

  createSciResearch() {
    console.log(this.sciResearchForm.value);

    let newSciResearch = new EditSciResearch();

    newSciResearch.title = this.sciResearchForm.get('title')?.value;
    newSciResearch.number = this.sciResearchForm.get('number')?.value;
    newSciResearch.duration = this.sciResearchForm.get('duration')?.value;
    newSciResearch.level = this.sciResearchForm.get('level')?.value;
    newSciResearch.rank = this.sciResearchForm.get('rank')?.value;
    newSciResearch.achievement = this.sciResearchForm.get('achievement')?.value;
    newSciResearch.fund = this.sciResearchForm.get('fund')?.value;
    newSciResearch.startDate = this.sciResearchForm.get('startDate')?.value;

    let teachersInControlArray = this.sciResearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newSciResearch.teachersIn = teachersInControlArray.controls.map((control) => control.value.id).filter((id) => id !== this.userId);
    }
    let teachersOutControlArray = this.sciResearchForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newSciResearch.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }

    let awardRecordsControlArray = this.sciResearchForm.get('awardRecords') as FormArray;
    if (awardRecordsControlArray && awardRecordsControlArray.length > 0) {
      newSciResearch.awards = awardRecordsControlArray.controls.map((control) => {
        let newAwardRecord = new EditAwardRecord();
        newAwardRecord.awardName = control.get('awardName')?.value;
        newAwardRecord.awardLevel = control.get('awardLevel')?.value;
        newAwardRecord.awardRank = control.get('awardRank')?.value;
        newAwardRecord.awardDate = control.get('awardDate')?.value;
        return newAwardRecord;
      });
    }

    console.log(newSciResearch);

    this.sciResearchService.createSciResearch(newSciResearch)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          if (res) {

            this.newSciResearchList.splice(this.index, 1);

            if (this.index > this.newSciResearchList.length - 1 && this.newSciResearchList.length > 0) {
              this.index = this.newSciResearchList.length - 1;
            }

            if (this.newSciResearchList.length > 0) {
              this.generateSciResearchForm();
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
        error: (err) => {
          console.error(err);
          this.snackBar.open('创建失败', '关闭', {
            duration: 2000,
          });
        }
      });
  }

  onPrevious() {
    if (this.index > 0) {
      this.index--;
      this.generateSciResearchForm();
    }
  }

  onNext() {
    if (this.index < this.newSciResearchList.length - 1) {
      this.index++;
      this.generateSciResearchForm();
    }
  }

  generateSciResearchForm() {
    this.sciResearchForm = new FormGroup({
      title: new FormControl(this.newSciResearchList[this.index].title || '', Validators.required),
      number: new FormControl(this.newSciResearchList[this.index].number || '', Validators.required),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      startDate: new FormControl(this.newSciResearchList[this.index].startDate || new Date(), Validators.required),
      duration: new FormControl(this.newSciResearchList[this.index].duration || ''),
      level: new FormControl(this.newSciResearchList[this.index].level || ''),
      rank: new FormControl(this.newSciResearchList[this.index].rank || ''),
      achievement: new FormControl(this.newSciResearchList[this.index].achievement || ''),
      fund: new FormControl(this.newSciResearchList[this.index].fund || ''),
      awardRecords: new FormArray([]),
    });

    if (this.newSciResearchList[this.index].teachersIn && this.newSciResearchList[this.index].teachersIn.length > 0) {
      let teachersInControlArray = this.sciResearchForm.get('teachersIn') as FormArray;
      this.newSciResearchList[this.index].teachersIn.forEach((teacher) => {
        teachersInControlArray.push(new FormControl(teacher));
      });
    }

    if (this.newSciResearchList[this.index].teachersOut && this.newSciResearchList[this.index].teachersOut!.length > 0) {
      let teachersOutControlArray = this.sciResearchForm.get('teachersOut') as FormArray;
      this.newSciResearchList[this.index].teachersOut!.forEach((teacher) => {
        teachersOutControlArray.push(new FormControl(teacher));
      });
    }

    if (this.newSciResearchList[this.index].awards && this.newSciResearchList[this.index].awards!.length > 0) {
      let awardRecordsControlArray = this.sciResearchForm.get('awardRecords') as FormArray;
      this.newSciResearchList[this.index].awards!.forEach((award) => {
        let awardRecord = new FormGroup({
          awardName: new FormControl(award.awardName || '', [Validators.required]),
          awardLevel: new FormControl(award.awardLevel || ''),
          awardRank: new FormControl(award.awardRank || ''),
          awardDate: new FormControl(award.awardDate || null)
        });
        awardRecordsControlArray.push(awardRecord);
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
