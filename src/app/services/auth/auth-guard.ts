// auth.guard.ts
import { AuthService } from './auth.service';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    return authService.router.navigate(['login'])
  }
};
