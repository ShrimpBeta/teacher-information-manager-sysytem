import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-passwordform',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatDivider, ReactiveFormsModule],
  templateUrl: './passwordform.component.html',
  styleUrl: './passwordform.component.scss'
})
export class PasswordformComponent {
  passwordHide = true;
  confirmPasswordHide = true;
  @Input() passwordGroup!: FormGroup;
  @Input() buttonLabel!: string;

  @Output() submitForm = new EventEmitter<any>();

  onSubmit() {
    this.submitForm.emit();
  }

}
