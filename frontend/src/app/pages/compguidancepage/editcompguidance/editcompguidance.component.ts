import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { CompguidanceformComponent } from '../../../components/compguidanceform/compguidanceform.component';

@Component({
  selector: 'app-editcompguidance',
  standalone: true,
  imports: [CompguidanceformComponent, MatDividerModule],
  templateUrl: './editcompguidance.component.html',
  styleUrl: './editcompguidance.component.scss'
})
export class EditcompguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '更新';
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
