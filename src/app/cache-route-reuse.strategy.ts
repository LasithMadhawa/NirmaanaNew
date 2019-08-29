import { RouteReuseStrategy } from "@angular/router/";
import { ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  allowRetriveCache = {
    show: true
  };
  shouldReuseRoute(
    before: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (
      (this.getPath(before) === "view/:artworkId" || "edit/:artworkId") &&
      this.getPath(curr) === "show"
    ) {
      this.allowRetriveCache["show"] = true;
    } else {
      this.allowRetriveCache["show"] = false;
    }
    return before.routeConfig === curr.routeConfig;
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(
      this.getPath(route)
    ) as DetachedRouteHandle;
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    if (this.allowRetriveCache[path]) {
      return this.storedRouteHandles.has(this.getPath(route));
    }

    return false;
  }
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    if (this.allowRetriveCache.hasOwnProperty(path)) {
      return true;
    }
    return false;
  }
  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {
    this.storedRouteHandles.set(this.getPath(route), detachedTree);
  }
  private getPath(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return "";
  }
}
