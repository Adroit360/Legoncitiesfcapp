import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}

export class RouteStrategy implements RouteReuseStrategy {
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig || route.routeConfig.loadChildren) {
            return false;
        }
        return true;
    }
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
       
    }
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        
        return true;
    }
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        
        return true;
    }


    handlers: { [key: string]: RouteStorageObject } = {};

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) return null;
        if (route.routeConfig.loadChildren) return null;
        return this.handlers[route.routeConfig.path];
    }

}