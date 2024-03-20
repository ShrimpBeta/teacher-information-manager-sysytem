import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { UserpannelComponent } from '../../components/userpannel/userpannel.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';



@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule,
    UserpannelComponent, RouterOutlet, RouterLink, RouterLinkActive, MatListModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  isDrawerOpen!: boolean;

  constructor(private meta: Meta, private responsive: BreakpointObserver) {

  }

  ngOnInit(): void {
    this.meta.updateTag({ property: 'og:title', content: 'Main Page' });
    this.meta.updateTag({ property: 'og:description', content: 'Main Page of TeacherInfoMS' });
    this.meta.updateTag({ property: 'og:image', content: 'Image URL' });
    // 响应大小小变化
    this.responsive.observe([
      Breakpoints.Medium,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isDrawerOpen = false;
      if (result.matches) {
        this.isDrawerOpen = true;
      }
    })
  }

}
