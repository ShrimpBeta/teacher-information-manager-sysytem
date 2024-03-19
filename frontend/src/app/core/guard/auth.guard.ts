import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  // const token = localStorage.getItem("");
  const token = false
  const router = inject(Router)
  if (token) {
    return true;
  } else {
    router.navigate(['/signin'])
    return false;
  }

};
