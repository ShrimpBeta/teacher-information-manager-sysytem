import { Component, OnDestroy, OnInit } from '@angular/core';
import { EdureformformComponent } from '../../../components/edureformform/edureformform.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../../services/user.service';
import { UserExport } from '../../../models/models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-newedureform',
  standalone: true,
  imports: [EdureformformComponent, MatDividerModule],
  templateUrl: './newedureform.component.html',
  styleUrl: './newedureform.component.scss'
})
export class NewedureformComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  eduReformForm!: FormGroup;
  teachersInOptions: UserExport[] = [];
  constructor(
    private userService: UserService,
  ) {

  }

  createEduReform() {
    console.log(this.eduReformForm.value);
  }

  ngOnInit(): void {
    this.eduReformForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      startDate: new FormControl(''),
      duration: new FormControl(''),
      level: new FormControl(''),
      rank: new FormControl(''),
      achievement: new FormControl(''),
      fund: new FormControl(''),
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
