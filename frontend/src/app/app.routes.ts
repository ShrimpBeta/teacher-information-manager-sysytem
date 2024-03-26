import { Routes } from '@angular/router';
import { authGuard, authGuardChild } from './core/guard/auth.guard';
import { MainComponent } from './pages/main/main.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { AccountComponent } from './pages/account/account.component';
import { PasswordComponent } from './pages/passwordpage/password/password.component';
import { ClassscheduleComponent } from './pages/classschedulepage/classschedule/classschedule.component';
import { CompguidanceComponent } from './pages/compguidancepage/compguidance/compguidance.component';
import { MentorshipComponent } from './pages/mentorshippage/mentorship/mentorship.component';
import { MonographComponent } from './pages/monographpage/monograph/monograph.component';
import { PaperComponent } from './pages/paperpage/paper/paper.component';
import { SciresearchComponent } from './pages/sciresearchpage/sciresearch/sciresearch.component';
import { WorkreportComponent } from './pages/workreport/workreport.component';
import { UgpgguidanceComponent } from './pages/ugpuguidancepage/ugpgguidance/ugpgguidance.component';
import { EdureformComponent } from './pages/edureformpage/edureform/edureform.component';
import { OverviewpasswordComponent } from './pages/passwordpage/overviewpassword/overviewpassword.component';
import { EditpasswordComponent } from './pages/passwordpage/editpassword/editpassword.component';
import { NewpasswordComponent } from './pages/passwordpage/newpassword/newpassword.component';
import { OverviewclassscheduleComponent } from './pages/classschedulepage/overviewclassschedule/overviewclassschedule.component';
import { EditclassscheduleComponent } from './pages/classschedulepage/editclassschedule/editclassschedule.component';
import { NewclassscheduleComponent } from './pages/classschedulepage/newclassschedule/newclassschedule.component';
import { OverviewedureformComponent } from './pages/edureformpage/overviewedureform/overviewedureform.component';
import { EditedureformComponent } from './pages/edureformpage/editedureform/editedureform.component';
import { NewedureformComponent } from './pages/edureformpage/newedureform/newedureform.component';
import { OverviewcompguidanceComponent } from './pages/compguidancepage/overviewcompguidance/overviewcompguidance.component';
import { EditcompguidanceComponent } from './pages/compguidancepage/editcompguidance/editcompguidance.component';
import { NewcompguidanceComponent } from './pages/compguidancepage/newcompguidance/newcompguidance.component';
import { OverviewugpgguidanceComponent } from './pages/ugpuguidancepage/overviewugpgguidance/overviewugpgguidance.component';
import { EditugpgguidanceComponent } from './pages/ugpuguidancepage/editugpgguidance/editugpgguidance.component';
import { NewugpgguidanceComponent } from './pages/ugpuguidancepage/newugpgguidance/newugpgguidance.component';
import { OverviewmentorshipComponent } from './pages/mentorshippage/overviewmentorship/overviewmentorship.component';
import { EditmentorshipComponent } from './pages/mentorshippage/editmentorship/editmentorship.component';
import { NewmentorshipComponent } from './pages/mentorshippage/newmentorship/newmentorship.component';
import { EditmonographComponent } from './pages/monographpage/editmonograph/editmonograph.component';
import { OverviewmonographComponent } from './pages/monographpage/overviewmonograph/overviewmonograph.component';
import { NewmonographComponent } from './pages/monographpage/newmonograph/newmonograph.component';
import { OverviewpaperComponent } from './pages/paperpage/overviewpaper/overviewpaper.component';
import { EditpaperComponent } from './pages/paperpage/editpaper/editpaper.component';
import { NewpaperComponent } from './pages/paperpage/newpaper/newpaper.component';
import { OverviewsciresearchComponent } from './pages/sciresearchpage/overviewsciresearch/overviewsciresearch.component';
import { EditsciresearchComponent } from './pages/sciresearchpage/editsciresearch/editsciresearch.component';
import { NewsciresearchComponent } from './pages/sciresearchpage/newsciresearch/newsciresearch.component';

export const routes: Routes = [
  {
    path: 'main', component: MainComponent, canActivate: [authGuard], canActivateChild: [authGuardChild],
    title: 'Main', children: [
      { path: '', redirectTo: 'workreport', pathMatch: 'full' },
      { path: 'workreport', component: WorkreportComponent, title: 'Work Report' },
      { path: 'account', component: AccountComponent, title: 'Account' },
      {
        path: 'password', component: PasswordComponent, title: 'Password', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewpasswordComponent, title: 'Overview Password' },
          { path: 'edit', component: EditpasswordComponent, title: 'Edit Password' },
          { path: 'new', component: NewpasswordComponent, title: 'New Password' }
        ]
      },
      {
        path: 'classschedule', component: ClassscheduleComponent, title: 'Class Schedule', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewclassscheduleComponent, title: 'Overview Class Schedule' },
          { path: 'edit', component: EditclassscheduleComponent, title: 'Edit Class Schedule' },
          { path: 'new', component: NewclassscheduleComponent, title: 'New Class Schedule' }
        ]
      },
      {
        path: 'educationreform', component: EdureformComponent, title: 'Education Reform', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewedureformComponent, title: 'Overview Education Reform' },
          { path: 'edit', component: EditedureformComponent, title: 'Edit Education Reform' },
          { path: 'new', component: NewedureformComponent, title: 'New Education Reform' }

        ]
      },
      {
        path: 'competitionguidance', component: CompguidanceComponent, title: 'Competition Guidance', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewcompguidanceComponent, title: 'Overview Competition Guidance' },
          { path: 'edit', component: EditcompguidanceComponent, title: 'Edit Competition Guidance' },
          { path: 'new', component: NewcompguidanceComponent, title: 'New Competition Guidance' }

        ]
      },
      {
        path: 'ugpgguidance', component: UgpgguidanceComponent, title: 'UG/PG Guidance', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewugpgguidanceComponent, title: 'Overview UG/PG Guidance' },
          { path: 'edit', component: EditugpgguidanceComponent, title: 'Edit UG/PG Guidance' },
          { path: 'new', component: NewugpgguidanceComponent, title: 'New UG/PG Guidance' }

        ]
      },
      {
        path: 'mentorship', component: MentorshipComponent, title: 'Mentorship', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewmentorshipComponent, title: 'Overview Mentorship' },
          { path: 'edit', component: EditmentorshipComponent, title: 'Edit Mentorship' },
          { path: 'new', component: NewmentorshipComponent, title: 'New Mentorship' }

        ]
      },
      {
        path: 'monograph', component: MonographComponent, title: 'Monograph', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewmonographComponent, title: 'Overview Monograph' },
          { path: 'edit', component: EditmonographComponent, title: 'Edit Monograph' },
          { path: 'new', component: NewmonographComponent, title: 'New Monograph' }

        ]
      },
      {
        path: 'paper', component: PaperComponent, title: 'Paper', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewpaperComponent, title: 'Overview Paper' },
          { path: 'edit', component: EditpaperComponent, title: 'Edit Paper' },
          { path: 'new', component: NewpaperComponent, title: 'New Paper' }

        ]
      },
      {
        path: 'scientificresearch', component: SciresearchComponent, title: 'Scientific Research', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewsciresearchComponent, title: 'Overview Scientific Research' },
          { path: 'edit', component: EditsciresearchComponent, title: 'Edit Scientific Research' },
          { path: 'new', component: NewsciresearchComponent, title: 'New Scientific Research' }

        ]
      },
    ],
  },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'resetpassword', component: ResetpasswordComponent, title: 'Reset Password' },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent, title: 'Not Found' }
];
