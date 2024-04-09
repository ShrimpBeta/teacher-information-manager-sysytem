import { Component, OnDestroy, OnInit } from '@angular/core';
import { MentorshipformComponent } from '../../../components/mentorshipform/mentorshipform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

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

  createMentorship() {
    console.log(this.mentorshipForm.value);
  }

  ngOnInit() {
    this.mentorshipForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      studentNames: new FormArray([]),
      grade: new FormControl(''),
      guidanceDate: new FormControl(''),
    });
  }

  ngOnDestroy() {
    console.log('EditmentorshipComponent destroyed');
  }
}
