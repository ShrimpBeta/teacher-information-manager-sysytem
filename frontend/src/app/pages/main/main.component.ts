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
  isSmallMode!: boolean;
  menuItems = [
    {
      title:'教学工作管理',
      links:[
        {path:'/main/password',name:'密码管理'},
        {path:'/main/classschedule',name:'课程表'},
        {path:'/main/educationreform',name:'教改项目'},
        {path:'/main/mentorship',name:'导师制'},
        {path:'/main/competitionguidance',name:'竞赛指导'},
      ]
    },
    {
      title:'科研工作管理',
      links:[
        {path:'/main/monograph',name:'专著'},
        {path:'/main/paper',name:'论文'},
        {path:'/main/scientificresearch',name:'科研项目'},
      ]
    },
    {
      title:'工作总结',
      links:[
        {path:'/main/workreport',name:'工作报告'},
      ]
    }
  ];


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
      this.isSmallMode = true;
      if (result.matches) {
        this.isDrawerOpen = true;
        this.isSmallMode = false;
      }
    })
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  // 关闭小屏模式抽屉
  closeDrawer() {
    if (this.isSmallMode && this.isDrawerOpen) {
      this.isDrawerOpen = false;
    }
  }

}
