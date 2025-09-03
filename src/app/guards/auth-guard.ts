import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { UserRequests } from '../api/user-service/user-requests';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router)
  const userService = inject(UserRequests);
  const loggedIn = await userService.getAuth();

  if (!loggedIn) {
    const loginPath = router.parseUrl("/login");
    return new RedirectCommand(loginPath, {
      skipLocationChange: true,
    });
  }

  return true;
};
