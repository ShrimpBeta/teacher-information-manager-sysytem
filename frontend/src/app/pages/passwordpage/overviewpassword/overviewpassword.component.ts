import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from '../../../models/models/password.model';
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
export class OverviewpasswordComponent implements OnInit {
  _selectedValue!: string;
  searchFormControl!: FormControl;
  destroy$ = new Subject<boolean>();
  passwordList: Password[] = [];

  constructor(
    private passwordService: PasswordService,
    private router: Router,
  ) { }

  ngOnInit() {
    this._selectedValue = '0';
    this.searchFormControl = new FormControl('', [Validators.required]);

    this.getPasswordList();
  }



  getPasswordList() {
    this.passwordService.getPasswords().pipe(takeUntil(this.destroy$)).subscribe({
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

  updatePasswordList() {

  }

  sortPasswordList() {
    let passwordListCopy = this.passwordList.slice();
    switch (this.selectedValue) {
      case '0':
        // 按名称排序
        passwordListCopy.sort((a, b) => a.appName.localeCompare(b.appName));
        break;
      case '1':
        // 按创建时间排序
        passwordListCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case '2':
        // 按修改时间排序
        passwordListCopy.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        break;
    }
    this.passwordList = passwordListCopy;

  }

  get selectedValue(): string {
    return this._selectedValue;
  }

  set selectedValue(value: string) {
    this._selectedValue = value;
    this.sortPasswordList();
  }

}
