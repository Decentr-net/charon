import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export const getParentUrlFromSnapshots = (
  route: ActivatedRouteSnapshot,
  routerState: RouterStateSnapshot,
): string => {
  return routerState.url
    .slice(0, routerState.url.indexOf(route.url[route.url.length - 1].path));
};
