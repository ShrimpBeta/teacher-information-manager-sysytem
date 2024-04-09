import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { UserpannelComponent } from '../../components/userpannel/userpannel.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule,
    UserpannelComponent, RouterOutlet, RouterLink, RouterLinkActive, MatListModule, MatDividerModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  isDrawerOpen!: boolean;
  isSmallMode!: boolean;
  drawerWidth!: string;
  menuItems = [
    {
      title: '教学工作管理',
      links: [
        { path: '/main/password', name: '密码管理' },
        { path: '/main/classschedule', name: '课程表' },
        { path: '/main/mentorship', name: '导师制' },
        { path: '/main/competitionguidance', name: '竞赛指导' },
        { path: '/main//ugpgguidance', name: '毕设指导' },
        { path: '/main/educationreform', name: '教改项目' },
      ]
    },
    {
      title: '科研工作管理',
      links: [
        { path: '/main/monograph', name: '专著' },
        { path: '/main/paper', name: '论文' },
        { path: '/main/scientificresearch', name: '科研项目' },
      ]
    },
    {
      title: '工作总结',
      links: [
        { path: '/main/workreport', name: '工作报告' },
      ]
    }
  ];


  constructor(private meta: Meta, private responsive: BreakpointObserver, private router: Router) {

  }

  ngOnInit(): void {
    this.meta.updateTag({ property: 'og:title', content: 'Main Page' });
    this.meta.updateTag({ property: 'og:description', content: 'Main Page of TeacherInfoMS' });
    this.meta.updateTag({ property: 'og:image', content: 'Image URL' });

    // 响应大小小变化
    this.responsive.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletLandscape,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.isDrawerOpen = false;
      this.isSmallMode = true;
      this.drawerWidth = '60%';
      if (result.matches) {
        this.isDrawerOpen = true;
        this.isSmallMode = false;
        this.drawerWidth = '20%'
        if (result.breakpoints[Breakpoints.TabletLandscape]) {
          this.drawerWidth = '25%';
        }
        if (result.breakpoints[Breakpoints.HandsetLandscape]) {
          this.drawerWidth = '30%';
        }
      }
    })
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // 关闭小屏模式抽屉
  closeDrawer() {
    if (this.isSmallMode && this.isDrawerOpen) {
      this.isDrawerOpen = false;
    }
  }

}
