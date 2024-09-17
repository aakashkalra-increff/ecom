import { AuthService } from './auth.service';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return true;
  } else {
    return authService.router.navigate(['login']);
  }
};
export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.isLoggedIn()) {
    return authService.router.navigate(['/']);
  } else {
    return true;
  }
};
export const checkoutGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const current_order_key= 'user/' + authService.getUserId() + '/current_order';
  const current_order = JSON.parse(localStorage.getItem(current_order_key)!);
  if (current_order != null) {
    return true;
  } else {
    return authService.router.navigate(['/']);
  }
};
