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
import { PreviewpasswordComponent } from './pages/passwordpage/previewpassword/previewpassword.component';
import { ExportpasswordComponent } from './pages/passwordpage/exportpassword/exportpassword.component';
import { PreviewclassscheduleComponent } from './pages/classschedulepage/previewclassschedule/previewclassschedule.component';
import { ExportclassscheduleComponent } from './pages/classschedulepage/exportclassschedule/exportclassschedule.component';
import { PreviewedureformComponent } from './pages/edureformpage/previewedureform/previewedureform.component';
import { ExportedureformComponent } from './pages/edureformpage/exportedureform/exportedureform.component';
import { PreviewcompguidanceComponent } from './pages/compguidancepage/previewcompguidance/previewcompguidance.component';
import { ExportcompguidanceComponent } from './pages/compguidancepage/exportcompguidance/exportcompguidance.component';
import { PreviewugpgguidanceComponent } from './pages/ugpuguidancepage/previewugpgguidance/previewugpgguidance.component';
import { ExportugpgguidanceComponent } from './pages/ugpuguidancepage/exportugpgguidance/exportugpgguidance.component';
import { PreviewmentorshipComponent } from './pages/mentorshippage/previewmentorship/previewmentorship.component';
import { ExportmentorshipComponent } from './pages/mentorshippage/exportmentorship/exportmentorship.component';
import { PreviewmonographComponent } from './pages/monographpage/previewmonograph/previewmonograph.component';
import { ExportmonographComponent } from './pages/monographpage/exportmonograph/exportmonograph.component';
import { PreviewpaperComponent } from './pages/paperpage/previewpaper/previewpaper.component';
import { ExportpaperComponent } from './pages/paperpage/exportpaper/exportpaper.component';
import { PreviewsciresearchComponent } from './pages/sciresearchpage/previewsciresearch/previewsciresearch.component';
import { ExportsciresearchComponent } from './pages/sciresearchpage/exportsciresearch/exportsciresearch.component';

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
          { path: 'edit/:id', component: EditpasswordComponent, title: 'Edit Password' },
          { path: 'new', component: NewpasswordComponent, title: 'New Password' },
          { path: 'preview', component: PreviewpasswordComponent, title: 'Preview Password' },
          { path: 'export', component: ExportpasswordComponent, title: 'Export Password' },
        ]
      },
      {
        path: 'classschedule', component: ClassscheduleComponent, title: 'Class Schedule', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewclassscheduleComponent, title: 'Overview Class Schedule' },
          { path: 'edit/:id', component: EditclassscheduleComponent, title: 'Edit Class Schedule' },
          { path: 'preview', component: PreviewclassscheduleComponent, title: 'Preview Class Schedule' },
          { path: 'export', component: ExportclassscheduleComponent, title: 'Export Class Schedule' },
        ]
      },
      {
        path: 'educationreform', component: EdureformComponent, title: 'Education Reform', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewedureformComponent, title: 'Overview Education Reform' },
          { path: 'edit/:id', component: EditedureformComponent, title: 'Edit Education Reform' },
          { path: 'new', component: NewedureformComponent, title: 'New Education Reform' },
          { path: 'preview', component: PreviewedureformComponent, title: 'Preview Education Reform' },
          { path: 'export', component: ExportedureformComponent, title: 'Export Education Reform' },
        ]
      },
      {
        path: 'competitionguidance', component: CompguidanceComponent, title: 'Competition Guidance', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewcompguidanceComponent, title: 'Overview Competition Guidance' },
          { path: 'edit/:id', component: EditcompguidanceComponent, title: 'Edit Competition Guidance' },
          { path: 'new', component: NewcompguidanceComponent, title: 'New Competition Guidance' },
          { path: 'preview', component: PreviewcompguidanceComponent, title: 'Preview Competition Guidance' },
          { path: 'export', component: ExportcompguidanceComponent, title: 'Export Competition Guidance' },
        ]
      },
      {
        path: 'ugpgguidance', component: UgpgguidanceComponent, title: 'UG/PG Guidance', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewugpgguidanceComponent, title: 'Overview UG/PG Guidance' },
          { path: 'edit/:id', component: EditugpgguidanceComponent, title: 'Edit UG/PG Guidance' },
          { path: 'new', component: NewugpgguidanceComponent, title: 'New UG/PG Guidance' },
          { path: 'preview', component: PreviewugpgguidanceComponent, title: 'Preview UG/PG Guidance' },
          { path: 'export', component: ExportugpgguidanceComponent, title: 'Export UG/PG Guidance' },
        ]
      },
      {
        path: 'mentorship', component: MentorshipComponent, title: 'Mentorship', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewmentorshipComponent, title: 'Overview Mentorship' },
          { path: 'edit/:id', component: EditmentorshipComponent, title: 'Edit Mentorship' },
          { path: 'new', component: NewmentorshipComponent, title: 'New Mentorship' },
          { path: 'preview', component: PreviewmentorshipComponent, title: 'Preview Mentorship' },
          { path: 'export', component: ExportmentorshipComponent, title: 'Export Mentorship' },
        ]
      },
      {
        path: 'monograph', component: MonographComponent, title: 'Monograph', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewmonographComponent, title: 'Overview Monograph' },
          { path: 'edit/:id', component: EditmonographComponent, title: 'Edit Monograph' },
          { path: 'new', component: NewmonographComponent, title: 'New Monograph' },
          { path: 'preview', component: PreviewmonographComponent, title: 'Preview Monograph' },
          { path: 'export', component: ExportmonographComponent, title: 'Export Monograph' },
        ]
      },
      {
        path: 'paper', component: PaperComponent, title: 'Paper', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewpaperComponent, title: 'Overview Paper' },
          { path: 'edit/:id', component: EditpaperComponent, title: 'Edit Paper' },
          { path: 'new', component: NewpaperComponent, title: 'New Paper' },
          { path: 'preview', component: PreviewpaperComponent, title: 'Preview Paper' },
          { path: 'export', component: ExportpaperComponent, title: 'Export Paper' },
        ]
      },
      {
        path: 'scientificresearch', component: SciresearchComponent, title: 'Scientific Research', children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'overview', component: OverviewsciresearchComponent, title: 'Overview Scientific Research' },
          { path: 'edit/:id', component: EditsciresearchComponent, title: 'Edit Scientific Research' },
          { path: 'new', component: NewsciresearchComponent, title: 'New Scientific Research' },
          { path: 'preview', component: PreviewsciresearchComponent, title: 'Preview Scientific Research' },
          { path: 'export', component: ExportsciresearchComponent, title: 'Export Scientific Research' },
        ]
      },
    ],
  },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: 'resetpassword', component: ResetpasswordComponent, title: 'Reset Password' },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', component: PagenotfoundComponent, title: 'Not Found' }
];
