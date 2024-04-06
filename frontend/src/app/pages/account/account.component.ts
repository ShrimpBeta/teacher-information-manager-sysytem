import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivateUser, ActivateUserResponse, UpdateUser, User } from '../../models/models/user.model';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { ApolloError } from '@apollo/client';


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
  passwordForm!: FormGroup;
  isSmallMode!: boolean;
  previewUrl: any = null;
  oldPasswordHide = true;
  passwordHide = true;
  isActivate = false;
  isUpdateUser = false;
  isUpdatePassword = false;

  constructor(
    private authRepository: AuthRepository,
    private responsive: BreakpointObserver,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
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
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletLandscape,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isSmallMode = true;
      if (result.matches) {
        this.isSmallMode = false;
      }
    })

    if (this.user?.activate) {
      this.userForm = new FormGroup({
        email: new FormControl({ value: this.user?.email, disabled: true }),
        username: new FormControl(this.user?.username, [Validators.required]),
        phoneNumber: new FormControl(this.user?.phoneNumber, [PhoneNumberValidator()]),
      });

      this.passwordForm = new FormGroup({
        oldPassword: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
        password: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
      });

      this.passwordForm.setValidators(PasswordMatchValidator);
    } else {
      this.userForm = new FormGroup({
        email: new FormControl({ value: this.user?.email, disabled: true }),
        username: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl(this.user?.phoneNumber, [PhoneNumberValidator()]),
        password: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
      });
      this.userForm.setValidators(PasswordMatchValidator)
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onFileSelected(event: Event) {
    let target = <HTMLInputElement>event.target
    if (target && target.files && target.files.length > 0) {
      let file = target.files[0];
      let allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.snackBar.open('请选择png、jpg、jpeg 或 webp图片文件', '关闭', {
          duration: 3000,
        });
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

  updateUser() {
    if (!this.userForm.valid) {
      return;
    }
    this.isUpdateUser = true;
    let updateUser: UpdateUser = new UpdateUser();

    updateUser.username = this.userForm.get('username')?.value;

    let fileInput = <HTMLInputElement>document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      updateUser.avatar = fileInput.files[0];
    }
    if (this.userForm.get('phoneNumber')?.value) {
      updateUser.phoneNumber = this.userForm.get('phoneNumber')?.value;
    }

    this.userService.updateUser(updateUser).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (user) => {
          this.snackBar.open('用户信息已更新', '关闭', {
            duration: 3000,
          });
          // 清空avatar，避免重复上传
          if (fileInput && fileInput.files && fileInput.files.length > 0) {
            this.previewUrl = null;
            fileInput.value = '';
          }
          this.isUpdateUser = false;
        },
        error: (error: ApolloError) => {
          if (!error.networkError) {
            this.snackBar.open('用户信息更新失败', '关闭', {
              duration: 3000,
            });
          } else {
            this.snackBar.open('网络错误或API错误，请稍后重试', '关闭', {
              duration: 3000,
            });
          }
          this.isUpdateUser = false;
        }
      }
    )
  }

  activateUser() {
    if (!this.userForm.valid) {
      if (this.userForm.get('password')?.value !== this.userForm.get('confirmPassword')?.value) {
        this.snackBar.open('两次输入密码不一致', '关闭', {
          duration: 3000,
        });
      }
      return;
    }
    this.isActivate = true;
    let activateUser: ActivateUser = new ActivateUser();
    activateUser.username = this.userForm.get('username')?.value;
    activateUser.password = this.userForm.get('password')?.value;
    if (this.userForm.get('phoneNumber')?.value) {
      activateUser.phoneNumber = this.userForm.get('phoneNumber')?.value;
    }
    let fileInput = <HTMLInputElement>document.querySelector('input[type="file"]');

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      activateUser.avatar = fileInput.files[0];
    }

    this.userService.activateUser(activateUser).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.snackBar.open('用户信息已激活', '关闭', {
          duration: 3000,
        });

        this.userForm = new FormGroup({
          email: new FormControl({ value: this.user?.email, disabled: true }),
          username: new FormControl(this.user?.username, [Validators.required]),
          phoneNumber: new FormControl(this.user?.phoneNumber, [PhoneNumberValidator()]),
        });

        this.passwordForm = new FormGroup({
          oldPassword: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
          password: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
          confirmPassword: new FormControl('', [Validators.required, PasswordFormatValidator(), Validators.minLength(8)]),
        });

        this.passwordForm.setValidators(PasswordMatchValidator);
        this.passwordHide = true;

        this.isActivate = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error: ApolloError) => {
        if (!error.networkError) {
          this.snackBar.open('用户信息激活失败', '关闭', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('网络错误或API错误，请稍后重试', '关闭', {
            duration: 3000,
          });
        }
        this.isActivate = false;
      }
    }
    )
  }

  updateUserPassword() {
    if (!this.passwordForm.valid) {
      if (this.passwordForm.get('password')?.value !== this.passwordForm.get('confirmPassword')?.value) {
        this.snackBar.open('两次输入密码不一致', '关闭', {
          duration: 3000,
        });
      }
      return;
    }
    this.isUpdatePassword = true;
    let updateUserPassword = {
      oldPassword: this.passwordForm.get('oldPassword')?.value,
      newPassword: this.passwordForm.get('password')?.value,
    }
    this.userService.updateUserPassword(updateUserPassword).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.snackBar.open('用户密码已更新', '关闭', {
          duration: 3000,
        });

        this.passwordForm.reset({
          oldPassword: '',
          password: '',
          confirmPassword: '',
        });

        this.passwordHide = true;
        this.oldPasswordHide = true;
        this.isUpdatePassword = false;
      },
      error: (error: ApolloError) => {
        if (!error.networkError) {
          this.snackBar.open(error.message, '关闭', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('网络错误或API错误，请稍后重试', '关闭', {
            duration: 3000,
          });
        }
        this.isUpdatePassword = false;
      }
    });

  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteuserdialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let userId = this.user?.id;
        if (userId) {
          this.userService.deleteUser(userId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (result) => {
              this.snackBar.open('删除账号成功', '关闭', {
                duration: 3000,
              });
              this.authRepository.clear();
            },
            error: (error: ApolloError) => {
              if (!error.networkError) {
                this.snackBar.open('用户删除失败', '关闭', {
                  duration: 3000,
                });
              } else {
                this.snackBar.open('网络错误或API错误，请稍后重试', '关闭', {
                  duration: 3000,
                });
              }
            }

          });
        }
      } else {
        alert('cancel delete user');
      }
    });
  }

  removeWechatAuth() {
    alert('remove wechat auth');
  }
}
