import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordTrue } from '../../../models/models/password.model';
import { MatDividerModule } from '@angular/material/divider';
import { PasswordformComponent } from '../../../components/passwordform/passwordform.component';
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
  password!: PasswordTrue;
  passwordForm: FormGroup = new FormGroup({
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
    private passwordService: PasswordService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.passwordService.getPassword(params['id'])
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (password) => {
            if (password) {
              this.password = password;

              this.passwordForm = new FormGroup({
                url: new FormControl(this.password?.url || '', [URLValidator()]),
                appName: new FormControl(this.password?.appName || ''),
                account: new FormControl(this.password?.account || '', [Validators.required]),
                password: new FormControl(this.password?.password || '', [Validators.required]),
                description: new FormControl(this.password?.description || ''),
              });
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
    this.passwordService.updatePassword(this.password.id, this.passwordForm.value)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (password) => {
          if (password) {
            this.snackBar.open('更新成功', '关闭', { duration: 3000 });
          }
        },
        error: (error: unknown) => {
          console.error(error);
          this.snackBar.open('更新失败', '关闭', { duration: 3000 });
        }
      });
  }

}
