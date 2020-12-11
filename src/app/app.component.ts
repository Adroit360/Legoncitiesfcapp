import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Application, Page } from "@nativescript/core";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
// import * as app from "tns-core-modules/application";
// import { Page } from "tns-core-modules/ui/page";
import { FirebaseService } from "~/services/firebase.service";

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    splashShown = true;
    constructor(private router: Router, 
        public firebaseService:FirebaseService,
        private page:Page,
        private activatedRoute:ActivatedRoute,
        private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {
        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        // if(this.activatedRoute.component)
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer><any>Application.getRootView();
        sideDrawer.closeDrawer();
    }

    signOut(){
        this.firebaseService.signOut();
    }

    splashFinished(){
        this.splashShown = false;
    }

}
