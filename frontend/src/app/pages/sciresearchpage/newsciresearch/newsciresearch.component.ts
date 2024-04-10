import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SciresearchformComponent } from '../../../components/sciresearchform/sciresearchform.component';
import { MatDividerModule } from '@angular/material/divider';
import { SciResearchService } from '../../../services/sciresearch.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditAwardRecord, EditSciResearch } from '../../../models/models/sciResearch.model';

@Component({
  selector: 'app-newsciresearch',
  standalone: true,
  imports: [SciresearchformComponent, MatDividerModule],
  templateUrl: './newsciresearch.component.html',
  styleUrl: './newsciresearch.component.scss'
})
export class NewsciresearchComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  sciResearchForm!: FormGroup;
  teachersInOptions: UserExport[] = [];
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sciResearchService: SciResearchService
  ) {

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

    let teachersInControlArray = this.sciResearchForm.get('teachersIn') as FormArray;
    if (teachersInControlArray && teachersInControlArray.length > 0) {
      newSciResearch.teachersIn = teachersInControlArray.controls.map((control) => control.value.id);
    }
    let teachersOutControlArray = this.sciResearchForm.get('teachersOut') as FormArray;
    if (teachersOutControlArray && teachersOutControlArray.length > 0) {
      newSciResearch.teachersOut = teachersOutControlArray.controls.map((control) => control.value);
    }
    if (this.sciResearchForm.get('startDate')?.value !== '') {
      newSciResearch.startDate = new Date(this.sciResearchForm.get('startDate')?.value);
    }
    let awardRecordsControlArray = this.sciResearchForm.get('awardRecords') as FormArray;
    if (awardRecordsControlArray && awardRecordsControlArray.length > 0) {
      newSciResearch.awards = awardRecordsControlArray.controls.map((control) => {
        let newAwardRecord = new EditAwardRecord();
        newAwardRecord.awardName = control.get('awardName')?.value;
        newAwardRecord.awardLevel = control.get('awardLevel')?.value;
        newAwardRecord.rank = control.get('awardRank')?.value;
        if (control.get('awardDate')?.value !== '') {
          newAwardRecord.awardDate = new Date(control.get('awardDate')?.value);
        }
        return newAwardRecord;
      });
    }

    console.log(newSciResearch);
  }

  ngOnInit(): void {
    this.sciResearchForm = new FormGroup({
      title: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      startDate: new FormControl(''),
      duration: new FormControl(''),
      level: new FormControl(''),
      rank: new FormControl(''),
      achievement: new FormControl(''),
      fund: new FormControl(''),
      awardRecords: new FormArray([]),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (res) => {
        this.teachersInOptions = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
