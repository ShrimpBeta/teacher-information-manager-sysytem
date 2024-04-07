import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password, PasswordFilter } from '../../../models/models/password.model';
import { Router, RouterLink } from '@angular/router';
import { PasswordService } from '../../../services/password.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-overviewpassword',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule, DatePipe],
  templateUrl: './overviewpassword.component.html',
  styleUrl: './overviewpassword.component.scss'
})
export class OverviewpasswordComponent implements OnInit, OnDestroy {

  searchFormControl!: FormControl;
  destroy$ = new Subject<boolean>();
  passwordList: Password[] = [];

  constructor(
    private passwordService: PasswordService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.searchFormControl = new FormControl('');

    this.getPasswordList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getPasswordList() {
    let passwordFilter = new PasswordFilter();
    if (this.searchFormControl.value.length > 0) {
      passwordFilter.appName = this.searchFormControl.value;
      passwordFilter.account = this.searchFormControl.value;
      passwordFilter.url = this.searchFormControl.value;
    }
    this.passwordService.getPasswords(passwordFilter).pipe(takeUntil(this.destroy$)).subscribe({
      next: (passwords) => {
        if (passwords) {
          this.passwordList = passwords;
        }
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }

  editPassword(password: Password) {
    this.router.navigate(['/main/password/edit', password.id]);
  }

  deletePassword(password: Password) {
    this.passwordService.deletePassword(password.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (passwords) => {
        if (passwords) {

        }
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }
}
