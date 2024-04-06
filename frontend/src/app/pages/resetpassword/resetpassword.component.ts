import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResetpasswordformComponent } from '../../components/resetpasswordform/resetpasswordform.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordFormatValidator } from '../../shared/formvalidator/passwordformat.validator';
import { PasswordMatchValidator } from '../../shared/formvalidator/passwordmatch.validator';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { ApolloError } from '@apollo/client';
import { EmailValidator } from '../../shared/formvalidator/email.validator';
import { CodeFormatValidator } from '../../shared/formvalidator/codeformat.validator';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [ResetpasswordformComponent],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm!: FormGroup;
  isResetting: boolean = false;
  isSendingCode: boolean = false;
  countdown: number = 0;
  countdownInterval: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private userService: UserService,
    private matsnackbar: MatSnackBar,
  ) { }

  //#region reset password
  handleResetPassword() {
    if (this.resetPasswordForm.invalid) {
      if (this.resetPasswordForm.get('password')?.value !== this.resetPasswordForm.get('confirmPassword')?.value) {
        this.matsnackbar.open('两次密码不一致', '关闭', {
          duration: 2000,
        });
      }
      return;
    } else {
      this.isResetting = true;
      this.userService.resetUserPassword({
        email: this.resetPasswordForm.get('email')?.value,
        password: this.resetPasswordForm.get('password')?.value,
        code: this.resetPasswordForm.get('code')?.value
      }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: unknown) => {
          this.matsnackbar.open('密码重置成功', '关闭', {
            duration: 2000,
          });
          // clear form
          this.resetPasswordForm.reset(
            {
              email: '',
              password: '',
              confirmPassword: '',
              code: ''
            }
          );
          this.resetPasswordForm.markAsPristine();
          this.resetPasswordForm.markAsUntouched();
          clearInterval(this.countdownInterval);
          this.countdown = 0;
          this.isResetting = false;
        },
        error: (error: ApolloError) => {
          if (!error.networkError) {
            this.matsnackbar.open(error.message, '关闭', {
              duration: 3000,
            });
          } else {
            this.matsnackbar.open('网络错误或API错误，请稍后重试', '关闭', {
              duration: 3000,
            });
          }
          this.isResetting = false;
        }
      });
    }
  }
  //#endregion

  //#region fetch code
  handleFetchCode() {
    if (this.resetPasswordForm.get('email')?.invalid) {
      this.matsnackbar.open('邮箱错误', 'close', {
        duration: 2000,
      });
      return;
    } else {
      this.isSendingCode = true;
      this.userService.fetchCode(this.resetPasswordForm.get('email')?.value)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (response: unknown) => {
            this.countdown = 60 * 5;
            this.countdownInterval = setInterval(() => {
              this.countdown--;
              if (this.countdown <= 0) {
                clearInterval(this.countdownInterval);
              }
            }, 1000);
            this.isSendingCode = false;
          },
          error: (error: ApolloError) => {
            if (!error.networkError) {
              this.matsnackbar.open(error.message, '关闭', {
                duration: 3000,
              });
            } else {
              this.matsnackbar.open('网络错误或API错误，请稍后重试', '关闭', {
                duration: 3000,
              });
            }
            this.isSendingCode = false;
          }
        });
    }
  }
  //#endregion

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, EmailValidator()]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), PasswordFormatValidator()]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), PasswordFormatValidator()]),
      code: new FormControl('', [Validators.required, CodeFormatValidator()]),
    });
    this.resetPasswordForm.setValidators(PasswordMatchValidator);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
