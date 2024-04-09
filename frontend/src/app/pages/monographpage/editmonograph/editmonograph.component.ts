import { Component } from '@angular/core';
import { MonographformComponent } from '../../../components/monographform/monographform.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-editmonograph',
  standalone: true,
  imports: [MonographformComponent, MatDividerModule],
  templateUrl: './editmonograph.component.html',
  styleUrl: './editmonograph.component.scss'
})
export class EditmonographComponent {

}
