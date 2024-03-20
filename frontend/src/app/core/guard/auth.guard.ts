import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthRepository } from '../auth/auth.repository';
import { JWT } from '../auth/jwt';

export const authGuardChild: CanActivateChildFn = (route, state) => {
  const router = inject(Router)
  const authRespository = inject(AuthRepository)
  const token = authRespository.getTokenVaule();

  if (token) {
    // 判断 token 是否过期
    if (JWT.getTokenExpiration(token)) {
      router.navigate(['/signin'])
      return false;
    }
    return true;
  } else {
    router.navigate(['/signin'])
    return false;
  }

};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authRespository = inject(AuthRepository)
  const token = authRespository.getTokenVaule();

  if (token) {
    // 判断 token 是否过期
    if (JWT.getTokenExpiration(token)) {
      router.navigate(['/signin'])
      return false;
    }
    return true;
  } else {
    router.navigate(['/signin'])
    return false;
  }

};
