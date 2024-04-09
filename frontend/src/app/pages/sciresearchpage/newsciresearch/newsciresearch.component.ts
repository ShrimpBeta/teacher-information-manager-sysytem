import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { SciresearchformComponent } from '../../../components/sciresearchform/sciresearchform.component';
import { MatDividerModule } from '@angular/material/divider';

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
  ) {

  }

  createSciResearch() {
    console.log(this.sciResearchForm.value);
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
