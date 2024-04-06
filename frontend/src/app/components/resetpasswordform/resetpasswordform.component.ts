import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-resetpasswordform',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './resetpasswordform.component.html',
  styleUrl: './resetpasswordform.component.scss'
})
export class ResetpasswordformComponent {
  hide: boolean = true;

  @Input() resetPasswordForm!: FormGroup;
  @Input() isrResetting!: boolean;
  @Input() isSendingCode!: boolean;
  @Input() countdown!: number;
  @Output() resetPassword = new EventEmitter<any>();
  @Output() fetchCode = new EventEmitter<any>();

  onSubmit() {
    this.resetPassword.emit();
  }

  sendCode() {
    this.fetchCode.emit()
  }

}
