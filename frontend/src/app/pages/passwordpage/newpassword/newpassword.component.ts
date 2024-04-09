import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { PasswordformComponent } from '../../../components/passwordform/passwordform.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PasswordService } from '../../../services/password.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { URLValidator } from '../../../shared/formvalidator/url.validator';

@Component({
  selector: 'app-newpassword',
  standalone: true,
  imports: [MatDividerModule, PasswordformComponent],
  templateUrl: './newpassword.component.html',
  styleUrl: './newpassword.component.scss'
})
export class NewpasswordComponent implements OnInit, OnDestroy {
  passwordForm!: FormGroup;
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
    this.passwordForm = new FormGroup({
      url: new FormControl('', [URLValidator()]),
      appName: new FormControl(''),
      account: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      description: new FormControl('')
    });

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
    this.passwordService.createPassword(this.passwordForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe(
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
