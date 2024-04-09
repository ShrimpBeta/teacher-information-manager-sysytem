import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonographformComponent } from '../../../components/monographform/monographform.component';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-newmonograph',
  standalone: true,
  imports: [MonographformComponent, MatDividerModule],
  templateUrl: './newmonograph.component.html',
  styleUrl: './newmonograph.component.scss'
})
export class NewmonographComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  monographForm!: FormGroup;
  teachersInOptions: UserExport[] = [];

  constructor(
    private userService: UserService,
  ) {
  }

  createMonograph() {
    console.log(this.monographForm.value);
  }

  ngOnInit(): void {
    this.monographForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(''),
      publishLevel: new FormControl(''),
      rank: new FormControl(''),
    });

    this.userService.userExports().pipe(takeUntil(this.$destroy)).subscribe({
      next: (userExports) => {
        this.teachersInOptions = userExports;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  ngOnDestroy() {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
