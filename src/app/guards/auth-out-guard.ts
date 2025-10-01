import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';
import { UserRequests } from '../api/user-service/user-requests';

export const authOutGuard: CanActivateFn = async () => {
  const router = inject(Router)
  const userService = inject(UserRequests);
  const loggedIn = await userService.getAuth();

  if (loggedIn) {
    const defaultPath = router.parseUrl("");
    return new RedirectCommand(defaultPath, {
      skipLocationChange: true,
    });
  }

  return true;
};
