import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/models/user.model';
import { Subject, takeUntil } from 'rxjs';
import { AuthRepository } from '../../core/auth/auth.repository';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PasswordFormatValidator } from '../../shared/formvalidator/passwordformat.validator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeleteuserdialogComponent } from '../../components/deleteuserdialog/deleteuserdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PhoneNumberValidator } from '../../shared/formvalidator/phonenumber.validator';
import { PasswordMatchValidator } from '../../shared/formvalidator/passwordmatch.validator';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatDividerModule, MatCardModule, MatInputModule, MatFormFieldModule,
    ReactiveFormsModule, MatButtonModule, MatIconModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, OnDestroy {
  user: User | undefined;
  private destroy$ = new Subject<boolean>();
  userForm!: FormGroup;
  isSmallMode!: boolean;
  previewUrl: any = null;
  formFieldWidth!: string;
  oldPasswordHide = true;
  passwordHide = true;
  confirmPasswordHide = true;

  constructor(
    private authRepository: AuthRepository,
    private responsive: BreakpointObserver,
    private dialog: MatDialog,
  ) {

  }

  ngOnInit(): void {
    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    // 响应大小小变化
    this.responsive.observe([
      Breakpoints.Medium,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isSmallMode = true;
      this.formFieldWidth = '100%';
      if (result.matches) {
        this.isSmallMode = false;
        this.formFieldWidth = '300px';
      }
    })

    this.userForm = new FormGroup({
      email: new FormControl({ value: this.user?.email, disabled: true }),
      username: new FormControl(this.user?.username, [Validators.required]),
      phoneNumber: new FormControl(this.user?.phoneNumber, [PhoneNumberValidator()]),
      avatar: new FormControl('', []),
      oldPassword: new FormControl('', [PasswordFormatValidator()]),
      password: new FormControl('', [PasswordFormatValidator()]),
      confirmPassword: new FormControl('', [PasswordFormatValidator()]),
    });

    this.userForm.setValidators(PasswordMatchValidator)
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onFileSelected(event: Event) {
    let target = <HTMLInputElement>event.target
    if (target && target.files && target.files.length > 0) {
      const file = target.files[0];
      if (!file.type.startsWith('image')) {
        alert('文件类型错误，请上传图片文件');
        target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.previewUrl = reader.result;
      }
    }
  }

  saveUser() {

  }

  activateUser() {

  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteuserdialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert('delete user');
      } else {
        alert('cancel delete user');
      }
    });
  }
}
