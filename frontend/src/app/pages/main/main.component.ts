import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private meta: Meta) { }

  ngOnInit(): void {
    this.meta.updateTag({ property: 'og:title', content: 'Main Page' });
    this.meta.updateTag({ property: 'og:description', content: 'Main Page of TeacherInfoMS' });
    this.meta.updateTag({ property: 'og:image', content: 'Image URL' });
  }
}
