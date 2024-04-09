import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-passwordform',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatDividerModule, ReactiveFormsModule],
  templateUrl: './passwordform.component.html',
  styleUrl: './passwordform.component.scss'
})
export class PasswordformComponent {
  hide = true;
  @Input() passwordForm!: FormGroup;
  @Input() buttonLabel!: string;

  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 3000 });
      return;
    }
    this.submitForm.emit();
  }

}
