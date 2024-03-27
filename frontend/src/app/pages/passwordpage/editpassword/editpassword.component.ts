import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Password } from '../../../models/models/password.model';
import { MatDividerModule } from '@angular/material/divider';
import { PasswordformComponent } from '../../../components/passwordform/passwordform.component';
import { PasswordMatchValidator } from '../../../shared/formvalidator/passwordmatch.validator';
import { PasswordService } from '../../../services/password.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { URLValidator } from '../../../shared/formvalidator/url.validator';

@Component({
  selector: 'app-editpassword',
  standalone: true,
  imports: [MatDividerModule, PasswordformComponent],
  templateUrl: './editpassword.component.html',
  styleUrl: './editpassword.component.scss'
})
export class EditpasswordComponent implements OnInit, OnDestroy {
  password!: Password;
  passwordGroup: FormGroup = new FormGroup({
    url: new FormControl('', [URLValidator]),
    appName: new FormControl(''),
    account: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  buttonLabel = '更新';
  private destroy$ = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private passwordService: PasswordService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.passwordService.getPassword(params['id']).pipe(takeUntil(this.destroy$)).subscribe({
        next: (password) => {
          if (password) {
            this.password = password;

            this.passwordGroup = new FormGroup({
              url: new FormControl(this.password?.url || '', [URLValidator()]),
              appName: new FormControl(this.password?.appName || ''),
              account: new FormControl(this.password?.account || '', [Validators.required]),
              password: new FormControl(this.password?.password || '', [Validators.required]),
              confirmPassword: new FormControl(this.password?.password || '', [Validators.required]),
              description: new FormControl(this.password?.description || ''),
            });

            this.passwordGroup.setValidators(PasswordMatchValidator);
            this.snackBar.open('获取密码成功', '关闭', { duration: 3000 });
          }
        },
        error: (error: unknown) => {
          this.snackBar.open('获取密码失败', '关闭', { duration: 3000 });
        }
      });
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  updatePassword(event: any) {
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

    this.passwordService.updatePassword(this.password.id, this.passwordGroup.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (password) => {
        if (password) {
          this.snackBar.open('更新成功', '关闭', { duration: 3000 });
          this.router.navigate(['/main/password']);
        }
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('更新失败', '关闭', { duration: 3000 });
      }
    });
  }

}
