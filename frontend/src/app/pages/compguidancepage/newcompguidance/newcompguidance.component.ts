import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompguidanceformComponent } from '../../../components/compguidanceform/compguidanceform.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newcompguidance',
  standalone: true,
  imports: [CompguidanceformComponent, MatDividerModule],
  templateUrl: './newcompguidance.component.html',
  styleUrl: './newcompguidance.component.scss'
})
export class NewcompguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '创建';
  compGuidanceForm!: FormGroup;
  constructor() { }

  createCompguidance() {
    console.log(this.compGuidanceForm.value);
  }

  ngOnInit(): void {
    this.compGuidanceForm = new FormGroup({
      projectName: new FormControl('', [Validators.required]),
      studentNames: new FormArray([]),
      competitionScore: new FormControl(''),
      guidanceDate: new FormControl(''),
      awardStatus: new FormControl(''),
    });
  }

  ngOnDestroy(): void {

  }
}
