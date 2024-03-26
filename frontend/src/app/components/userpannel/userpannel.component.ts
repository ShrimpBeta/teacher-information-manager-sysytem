import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/models/user.model';
import { AuthRepository } from '../../core/auth/auth.repository';
import { filter, Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { fromEvent } from 'rxjs';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-userpannel',
  standalone: true,
  imports: [MatRippleModule, MatDividerModule, MatButtonModule, RouterLink],
  templateUrl: './userpannel.component.html',
  styleUrl: './userpannel.component.scss',
  animations: [
    trigger('openClose', [
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('open <=> closed', [animate('0.5s')])
    ])
  ],
})
export class UserpannelComponent implements OnInit, OnDestroy {
  user: User | undefined;
  destroy$: Subject<boolean> = new Subject<boolean>();
  showPanel: boolean = false;
  @ViewChild('popupPanel')
  popupPanel!: ElementRef;

  constructor(
    private authRepository: AuthRepository,
    private router: Router
  ) {

  }

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  account() {
    this.router.navigate(['/main/account']);
  }

  logout() {
    this.authRepository.clear();
    this.router.navigate(['/signin']);
  }

  ngOnInit(): void {
    this.authRepository.$user.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.user = user;
      } else {
        this.router.navigate(['signin'])
      }
    });

    fromEvent(document, 'click').pipe(
      filter(event => this.showPanel && !this.popupPanel.nativeElement.contains(event.target)),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showPanel = false;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
