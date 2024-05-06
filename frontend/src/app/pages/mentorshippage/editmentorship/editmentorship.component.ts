import { Component, OnDestroy, OnInit } from '@angular/core';
import { MentorshipformComponent } from '../../../components/mentorshipform/mentorshipform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { EditMentorship, Mentorship } from '../../../models/models/mentorship.model';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MentorshipService } from '../../../services/mentorship.service';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';

@Component({
  selector: 'app-editmentorship',
  standalone: true,
  imports: [MentorshipformComponent, MatDividerModule, DatePipe],
  templateUrl: './editmentorship.component.html',
  styleUrl: './editmentorship.component.scss'
})
export class EditmentorshipComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  mentorshipForm!: FormGroup;
  mentorship!: Mentorship;
  private destroy$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private mentorshipService: MentorshipService,
    private snackBar: MatSnackBar,
  ) { }

  updateMentorship() {

    console.log(this.mentorshipForm.value);

    let updateMentorship = new EditMentorship();
    updateMentorship.projectName = this.mentorshipForm.get('projectName')?.value;
    updateMentorship.grade = this.mentorshipForm.get('grade')?.value;
    updateMentorship.guidanceDate = this.mentorshipForm.get('guidanceDate')?.value;

    let studentNamesContorlArray = this.mentorshipForm.get('studentNames') as FormArray;
    if (studentNamesContorlArray && studentNamesContorlArray.length > 0) {
      updateMentorship.studentNames = studentNamesContorlArray.controls.map((control) => control.value);
    }

    console.log(updateMentorship);

    this.mentorshipService.updateMentorship(this.mentorship.id, updateMentorship)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (result) => {
          if (result) {
            this.mentorship = result;
            this.snackBar.open('更新成功', '关闭', { duration: 2000 });
          } else {
            this.snackBar.open('更新失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('更新失败', '关闭', { duration: 2000 });
        }
      });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.mentorshipService.getMentorship(params['id']).subscribe({
        next: (mentorship) => {
          if (mentorship) {
            this.mentorship = mentorship;
            this.mentorshipForm = new FormGroup({
              projectName: new FormControl(this.mentorship.projectName, [Validators.required]),
              studentNames: new FormArray([], [ArrayEmptyValidator()]),
              grade: new FormControl(this.mentorship.grade || null),
              guidanceDate: new FormControl(this.mentorship.guidanceDate, [Validators.required]),
            });

            if (this.mentorship.studentNames) {
              this.mentorship.studentNames.forEach((studentName) => {
                (this.mentorshipForm.get('studentNames') as FormArray).push(new FormControl(studentName));
              });
            }

            this.snackBar.open('获取数据成功', '关闭', { duration: 2000 });
          } else {
            this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('获取数据失败', '关闭', { duration: 2000 });
        }
      });
    });

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
