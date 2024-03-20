import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/models/user.model';
import { AuthRepository } from '../../core/auth/auth.repository';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userpannel',
  standalone: true,
  imports: [],
  templateUrl: './userpannel.component.html',
  styleUrl: './userpannel.component.scss'
})
export class UserpannelComponent implements OnInit, OnDestroy {
  user: User | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private authRepository: AuthRepository,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['signin'])
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
