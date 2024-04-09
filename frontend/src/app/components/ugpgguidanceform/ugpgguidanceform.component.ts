import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ugpgguidanceform',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatDividerModule,
    ReactiveFormsModule, MatDatepickerModule, MatChipsModule],
  templateUrl: './ugpgguidanceform.component.html',
  styleUrl: './ugpgguidanceform.component.scss'
})
export class UgpgguidanceformComponent {
  @Input() buttonLabel!: string;
  @Input() ugpgGuidanceForm!: FormGroup;

  @Output() submitForm = new EventEmitter<any>();

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  onSubmit() {
    if (this.ugpgGuidanceForm.invalid) {
      this.snackBar.open('请检查表单', '关闭', { duration: 2000 });
      return;
    }
    this.submitForm.emit();
  }
}
