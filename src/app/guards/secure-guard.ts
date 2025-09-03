import { inject } from '@angular/core';
import { Router, CanActivateFn, RedirectCommand } from '@angular/router';

export const secureGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  //const secure = location.protocol;
  const secure = 'https';

  // Redirect if insecure
  if (secure !== 'https') {
    const securePath = router.parseUrl(`https://${route.fragment}${route.url}`);
    return new RedirectCommand(securePath, {
      skipLocationChange: true,
    });
  }

  return true;
};
