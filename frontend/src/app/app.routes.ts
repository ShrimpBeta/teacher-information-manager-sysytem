import { Routes } from '@angular/router';
import { SignupComponent } from './routes/signup/signup.component';
import { authGuard } from './guard/auth.guard';
import { MainComponent } from './routes/main/main.component';
import { PagenotfoundComponent } from './routes/pagenotfound/pagenotfound.component';

export const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [authGuard] },
  { path: 'signup', component: SignupComponent },
  { path: '**', component: PagenotfoundComponent }
];
