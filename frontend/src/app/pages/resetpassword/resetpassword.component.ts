import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResetpasswordformComponent } from '../../components/resetpasswordform/resetpasswordform.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordFormatValidator } from '../../shared/formvalidator/passwordformat.validator';
import { PasswordMatchValidator } from '../../shared/formvalidator/passwordmatch.validator';
import { UserService } from '../../services/user.service';

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

  handleResetPasswordFormSubmit() {
    
  }

  handleFetchCode() {

    this.countdown = 60 * 5;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  constructor(
    private userService: UserService,
  ) { }



  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), PasswordFormatValidator()]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), PasswordFormatValidator()])
    });
    this.resetPasswordForm.setValidators(PasswordMatchValidator);
  }

  ngOnDestroy(): void {
  }


}
