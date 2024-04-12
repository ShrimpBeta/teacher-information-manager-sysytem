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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-overviewpassword',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatTooltipModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './overviewpassword.component.html',
  styleUrl: './overviewpassword.component.scss'
})
export class OverviewpasswordComponent implements OnInit, OnDestroy {

  searchFormControl!: FormControl;
  private destroy$ = new Subject<boolean>();
  // data
  passwordList: Password[] = [];
  // page
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  isSearching: boolean = false;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.searchFormControl = new FormControl('');

    this.getPasswordList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSearch() {
    // reset page
    this.pageIndex = 0;
    this.pageSize = 10;
    this.getPasswordList();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getPasswordList();
  }

  getPasswordList() {
    let passwordFilter = new PasswordFilter();
    if (this.searchFormControl.value.length > 0) {
      passwordFilter.appName = this.searchFormControl.value;
      passwordFilter.account = this.searchFormControl.value;
      passwordFilter.url = this.searchFormControl.value;
    }
    this.isSearching = true;
    this.passwordService.getPasswordsByFilter(passwordFilter, this.pageIndex, this.pageSize).pipe(takeUntil(this.destroy$)).subscribe({
      next: (passwordsPage) => {
        if (passwordsPage) {
          this.passwordList = passwordsPage.passwords;
          this.totalCount = passwordsPage.totalCount;
        }
        this.isSearching = false;
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('Error getting passwords', '', {
          duration: 2000
        });
        this.isSearching = false;
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
          this.snackBar.open('删除密码成功', '关闭', {
            duration: 2000
          });
          this.passwordList = this.passwordList.filter(p => p.id !== password.id);
          this.totalCount -= 1;
        } else {
          this.snackBar.open('删除密码失败', '关闭', {
            duration: 2000
          });
        }
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('删除密码失败', '关闭', {
          duration: 2000
        });
      }
    });
  }
}
