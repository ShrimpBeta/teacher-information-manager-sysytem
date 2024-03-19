import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signout',
  standalone: true,
  imports: [],
  templateUrl: './signout.component.html',
  styleUrl: './signout.component.scss'
})
export class SignoutComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    setTimeout(() => {
      router.navigate(['/signin'])
    }, 3000);
  }

  ngOnInit(): void {
    const origin = this.activatedRoute.snapshot.queryParams['origin']
    const message = this.activatedRoute.snapshot.queryParams['message']
  }
}
