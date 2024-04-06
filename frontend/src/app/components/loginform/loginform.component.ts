import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordFormatValidator } from '../../shared/formvalidator/passwordformat.validator';
import { EmailValidator } from '../../shared/formvalidator/email.validator';

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } }],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.scss'
})
export class LoginformComponent implements OnInit {
  hide: boolean = true;
  signInForm!: FormGroup;
  @Output() signIn = new EventEmitter<any>();
  @Input() isSignin: boolean = false;

  constructor(
  ) {}

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, EmailValidator()]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), PasswordFormatValidator()])
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.signIn.emit(this.signInForm.value);
    }
  }

}
