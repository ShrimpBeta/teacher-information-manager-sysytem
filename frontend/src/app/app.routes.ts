import { Routes } from '@angular/router';
import { authGuard, authGuardChild } from './core/guard/auth.guard';
import { MainComponent } from './pages/main/main.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { SigninComponent } from './pages/signin/signin.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { AccountComponent } from './pages/account/account.component';
import { PasswordComponent } from './pages/password/password.component';
import { ClassscheduleComponent } from './pages/classschedule/classschedule.component';
import { CompguidanceComponent } from './pages/compguidance/compguidance.component';
import { MentorshipComponent } from './pages/mentorship/mentorship.component';
import { MonographComponent } from './pages/monograph/monograph.component';
import { PaperComponent } from './pages/paper/paper.component';
import { SciresearchComponent } from './pages/sciresearch/sciresearch.component';
import { WorkreportComponent } from './pages/workreport/workreport.component';
import { UgpgguidanceComponent } from './pages/ugpgguidance/ugpgguidance.component';
import { EdureformComponent } from './pages/edureform/edureform.component';

export const routes: Routes = [
  {
    path: 'main', component: MainComponent, canActivate: [authGuard], canActivateChild: [authGuardChild],
    title: 'Main', children: [
      { path: '', redirectTo: 'workreport', pathMatch: 'full' },
      { path: 'workreport', component: WorkreportComponent, title: 'Work Report' },
      { path: 'account', component: AccountComponent, title: 'Account' },
      { path: 'password', component: PasswordComponent, title: 'Password' },
      { path: 'classschedule', component: ClassscheduleComponent, title: 'Class Schedule' },
      { path: 'educationreform', component: EdureformComponent, title: 'Education Reform' },
      { path: 'competitionguidance', component: CompguidanceComponent, title: 'Competition Guidance' },
      { path: 'ugpgguidance', component: UgpgguidanceComponent, title: 'UG/PG Guidance' },
      { path: 'mentorship', component: MentorshipComponent, title: 'Mentorship' },
      { path: 'monograph', component: MonographComponent, title: 'Monograph' },
      { path: 'paper', component: PaperComponent, title: 'Paper' },
      { path: 'scientificresearch', component: SciresearchComponent, title: 'Scientific Research' },
    ],
  },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'resetpassword', component: ResetpasswordComponent, title: 'Reset Password' },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent, title: 'Not Found' }
];
