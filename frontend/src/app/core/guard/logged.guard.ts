import { CanActivateFn, Router } from '@angular/router';
import { AuthRepository } from '../auth/auth.repository';
import { inject } from '@angular/core';
import { JWT } from '../auth/jwt';

export const loggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authRespository = inject(AuthRepository)
  const token = authRespository.getTokenVaule();

  if (token) {
    // 判断 token 是否过期
    if (JWT.getTokenExpiration(token)) {
      return true;
    }
    // 如果 token 未过期，跳转到首页
    router.navigate(['/main']);
    return false;
  } else {
    return true;
  }
};
