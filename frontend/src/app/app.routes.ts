import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { MainComponent } from './pages/main/main.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignoutComponent } from './pages/signout/signout.component';

export const routes: Routes = [
  { path: 'main', component: MainComponent, canActivate: [authGuard], title: 'Main' },
  { path: 'signin', component: SigninComponent, title: 'Sign In' },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'signout', component: SignoutComponent, title: 'Sign Out' },
  { path: '**', component: PagenotfoundComponent, title: 'Not Found' }
];
