import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { PasswordformComponent } from '../../../components/passwordform/passwordform.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordMatchValidator } from '../../../shared/formvalidator/passwordmatch.validator';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PasswordService } from '../../../services/password.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { URLValidator } from '../../../shared/formvalidator/url.validator';

@Component({
  selector: 'app-newpassword',
  standalone: true,
  imports: [MatDivider, PasswordformComponent],
  templateUrl: './newpassword.component.html',
  styleUrl: './newpassword.component.scss'
})
export class NewpasswordComponent implements OnInit, OnDestroy {
  passwordGroup!: FormGroup;
  buttonLabel: string = '创建';
  isSmallMode!: boolean;
  private destroy$ = new Subject<boolean>();

  constructor(
    private responsive: BreakpointObserver,
    private passwordService: PasswordService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.passwordGroup = new FormGroup({
      url: new FormControl('', [URLValidator()]),
      appName: new FormControl(''),
      account: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });

    this.passwordGroup.setValidators(PasswordMatchValidator)

    // 响应大小小变化
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletLandscape,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isSmallMode = true;
      if (result.matches) {
        this.isSmallMode = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createPassword(event: any) {
    if (this.passwordGroup.invalid) {
      let message = '请填写所有必填项 ';
      if (this.passwordGroup.get('url')?.invalid) {
        message += 'URL格式错误 ';
      }
      if (this.passwordGroup.get('account')?.invalid) {
        message += '账号为空 ';
      }
      if (this.passwordGroup.get('password')?.invalid) {
        message += '密码为空 ';
      }
      if (this.passwordGroup.get('confirmPassword')?.invalid) {
        message += '确认密码为空 ';
      }
      if (this.passwordGroup.get('password')?.value !== this.passwordGroup.get('confirmPassword')?.value) {
        message += '密码不一致';
      }
      this.snackBar.open(message, '关闭', { duration: 3000 });
      return;
    }

    this.passwordService.createPassword(this.passwordGroup.value).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (password) => {
          if (password) {
            this.snackBar.open('创建密码成功', '关闭', { duration: 3000 });
            this.router.navigate(['/main/password']);
          } else {
            this.snackBar.open('创建密码失败', '关闭', { duration: 3000 });
          }
        },
        error: (error) => {
          this.snackBar.open('创建密码失败', '关闭', { duration: 3000 });
        }
      })
  }
}
