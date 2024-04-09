import { Component, OnDestroy, OnInit } from '@angular/core';
import { MentorshipformComponent } from '../../../components/mentorshipform/mentorshipform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-editmentorship',
  standalone: true,
  imports: [MentorshipformComponent, MatDividerModule],
  templateUrl: './editmentorship.component.html',
  styleUrl: './editmentorship.component.scss'
})
export class EditmentorshipComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
  mentorshipForm!: FormGroup

  createMentorship() {
    this.mentorshipForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      studentNames: new FormArray([]),
      grade: new FormControl(''),
      guidanceDate: new FormControl(''),
    });
  }

  ngOnInit() {
    console.log('EditmentorshipComponent initialized');
  }

  ngOnDestroy() {
    console.log('EditmentorshipComponent destroyed');
  }

}
