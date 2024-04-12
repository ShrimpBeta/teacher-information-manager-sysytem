import { Component, OnDestroy, OnInit } from '@angular/core';
import { MentorshipformComponent } from '../../../components/mentorshipform/mentorshipform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MentorshipService } from '../../../services/mentorship.service';
import { EditMentorship } from '../../../models/models/mentorship.model';
import { ArrayEmptyValidator } from '../../../shared/formvalidator/arrayempty.validator';

@Component({
  selector: 'app-newmentorship',
  standalone: true,
  imports: [MentorshipformComponent, MatDividerModule],
  templateUrl: './newmentorship.component.html',
  styleUrl: './newmentorship.component.scss'
})
export class NewmentorshipComponent implements OnInit, OnDestroy {
  buttonLabel = '创建';
  mentorshipForm!: FormGroup
  private destroy$ = new Subject<boolean>();
  constructor(
    private mentorshipService: MentorshipService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
  }

  createMentorship() {
    console.log(this.mentorshipForm.value);
    let newMentorship = new EditMentorship();
    newMentorship.projectName = this.mentorshipForm.get('projectName')?.value;
    newMentorship.grade = this.mentorshipForm.get('grade')?.value;

    let studentNamesControlArray = this.mentorshipForm.get('studentNames') as FormArray;
    if (studentNamesControlArray && studentNamesControlArray.length > 0) {
      newMentorship.studentNames = studentNamesControlArray.controls.map((control) => control.value);
    }

    if (this.mentorshipForm.get('guidanceDate')?.value !== '') {
      newMentorship.guidanceDate = new Date(this.mentorshipForm.get('guidanceDate')?.value);
    }
    console.log(newMentorship);
    this.mentorshipService.createMentorship(newMentorship).subscribe({
      next: (response) => {
        if (response) {
          this.snackBar.open('创建成功', '关闭', {
            duration: 2000,
          });
          this.router.navigate(['/main/mentorship']);
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

  ngOnInit() {
    this.mentorshipForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      studentNames: new FormArray([], [ArrayEmptyValidator()]),
      grade: new FormControl(''),
      guidanceDate: new FormControl(''),
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
