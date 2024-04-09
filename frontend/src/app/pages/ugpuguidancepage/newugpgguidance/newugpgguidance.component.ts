import { Component, OnDestroy, OnInit } from '@angular/core';
import { UgpgguidanceformComponent } from '../../../components/ugpgguidanceform/ugpgguidanceform.component';
import { MatDividerModule } from '@angular/material/divider';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-newugpgguidance',
  standalone: true,
  imports: [MatDividerModule, UgpgguidanceformComponent],
  templateUrl: './newugpgguidance.component.html',
  styleUrl: './newugpgguidance.component.scss'
})
export class NewugpgguidanceComponent implements OnInit, OnDestroy {
  buttonLabel = '创建';
  ugpgGuidanceForm!: FormGroup;
  constructor() { }

  createUgpgGuidance() {
    console.log(this.ugpgGuidanceForm.value);
  }

  ngOnInit(): void {
    this.ugpgGuidanceForm = new FormGroup({
      studentName: new FormControl('', [Validators.required]),
      thesisTopic: new FormControl('', [Validators.required]),
      openingCheckDate: new FormControl(''),
      openingCheckResult: new FormControl(''),
      midtermCheckDate: new FormControl(''),
      midtermCheckResult: new FormControl(''),
      defenseDate: new FormControl(''),
      defenseResult: new FormControl(''),
    });
  }

  ngOnDestroy(): void {

  }
}
