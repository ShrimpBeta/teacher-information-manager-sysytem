import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { LoginformComponent } from '../../components/loginform/loginform.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [NgClass, LoginformComponent],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
