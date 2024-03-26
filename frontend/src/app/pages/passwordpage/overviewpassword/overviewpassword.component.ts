import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from '@apollo/client';
import { Password } from '../../../models/models/password.model';
@Component({
  selector: 'app-overviewpassword',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './overviewpassword.component.html',
  styleUrl: './overviewpassword.component.scss'
})
export class OverviewpasswordComponent implements OnInit {
  selectedValue!: string;
  searchFormControl!: FormControl;
  passwordList$ = Observable<Password[]>

  ngOnInit() {
    this.selectedValue = '0';
    this.searchFormControl = new FormControl('', [Validators.required]);

  }

  getDefaultPasswordList() {

  }

  updatePasswordList() {

  }

}
