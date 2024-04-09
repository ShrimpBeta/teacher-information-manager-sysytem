import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil } from 'rxjs';
import { UserExport } from '../../../models/models/user.model';
import { UserService } from '../../../services/user.service';
import { PaperformComponent } from '../../../components/paperform/paperform.component';

@Component({
  selector: 'app-newpaper',
  standalone: true,
  imports: [PaperformComponent, MatDividerModule],
  templateUrl: './newpaper.component.html',
  styleUrl: './newpaper.component.scss'
})
export class NewpaperComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();
  buttonLabel = '创建';
  paperForm!: FormGroup;
  teachersInOptions: UserExport[] = [];
  constructor(
    private userService: UserService,
  ) {

  }

  createPaper(): void {
    console.log(this.paperForm.value);
  }

  ngOnInit(): void {
    this.paperForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      teachersIn: new FormArray([]),
      teachersOut: new FormArray([]),
      publishDate: new FormControl(''),
      rank: new FormControl(''),
      journalName: new FormControl(''),
      journalLevel: new FormControl(''),
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

  ngOnDestroy(): void {
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
