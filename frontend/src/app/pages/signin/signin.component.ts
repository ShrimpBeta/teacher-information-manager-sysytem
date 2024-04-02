import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { LoginformComponent } from '../../components/loginform/loginform.component';
import { AuthService } from '../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApolloError } from '@apollo/client';
import { AuthUserData } from '../../core/auth/auth.repository';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [LoginformComponent, MatSnackBarModule, MatButtonModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent implements OnDestroy {
  email!: string;
  password!: string;
  // 是否登录中，避免重复提交登录请求
  isSignin: boolean = false;
  window: Window;
  // 销毁订阅
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private document: Document,
    private snackBar: MatSnackBar,
  ) {
    this.window = this.document.defaultView as Window;
  }

  handleSignIn(event: any) {
    this.email = event.email;
    this.password = event.password;
    this.isSignin = true;
    // 登录
    this.authService.signIn(this.email, this.password)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (response: unknown) => {
          // 处理登录响应
          this.handleSignInResponse(response);
        },
        error: (error: ApolloError) => {
          // 处理登录错误
          this.handleSignInError(error);
        }
      })
  }

  handleSignInResponse(response: unknown) {
    // 获取登录来源，登录成功后跳转到来源页面
    const origin = this.activatedRoute.snapshot.queryParams['origin'];
    const user = (response as AuthUserData).user;
    if (user) {
      if (origin) {
        this.window.location.href = decodeURIComponent(origin);
      } else {
        // 账号未激活，前往用户管理页面
        if (user.activate === false) {
          return this.router.navigate(['/main/account']).then(() => {
            // 取消订阅
            this.destroy$.next(true);
            return this.destroy$.unsubscribe();
          });
        }
        return this.router.navigate(['/main']).then(() => {
          // 取消订阅
          this.destroy$.next(true);
          return this.destroy$.unsubscribe();
        });
      }
    }
    // 强制更新视图
    return this.changeDetectorRef.detectChanges();
  }

  handleSignInError(error: ApolloError) {
    // 检测是否为Apollo请求错误
    const networkError = error.networkError;
    if (!networkError) {
      // 提示用户
      this.snackBar.open('登录失败，请检查邮箱和密码是否正确', '关闭', {
        duration: 3000,
      });
    } else {
      // 提示用户
      this.snackBar.open('网络错误或API错误', '关闭', {
        duration: 3000,
      });
    }
    this.isSignin = false;
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // 取消订阅
    // this.destroy$.next(true);
    // this.destroy$.complete();

  }
}
