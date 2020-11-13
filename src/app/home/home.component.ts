import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActionBar } from "tns-core-modules/ui/action-bar";
import { EventData, isAndroid, isIOS, Page } from "tns-core-modules/ui/page";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";
import { ImageSource } from "tns-core-modules/image-source";
import { of } from "rxjs";
import * as fileSystemModule from "tns-core-modules/file-system";

import { MiscService } from "~/services/misc.service";


@Component({
    selector: "Home",
    templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
    constructor(
        private router: Router,
        private firebaseService: FirebaseService,
        private page: Page,
        private miscService: MiscService,
        private activatedRoute: ActivatedRoute
    ) {
        // Use the component constructor to inject providers.
        //console.log(this.activatedRoute);
        page.backgroundSpanUnderStatusBar = true;
    }

    ngOnInit(): void {
        // Init your component properties here.

        global['route'] = "home";

        this.router.navigate(
            [
                {
                    outlets: {
                        landing: ["landing"],
                        fixtures: ["fixtures"],
                        players: ["players"],
                        news: ["news"],
                        chat: ["chat"],
                    },
                },
            ],
            {
                relativeTo: this.activatedRoute,
            }
        );
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onLoaded(event: EventData) {
        if (isAndroid) {
            const layout = <any>event.object,
                page = layout.page;

            if (page.android) {
                //page.android.removeRowAt(0);
            }
        }
    }

    onActionBarLoaded(event: EventData) {
        if (isIOS) {
            const actionBar = <ActionBar>event.object;
            if (actionBar.ios) {
                (<any>actionBar).updateFlatness = function (navBar) {
                    actionBar.ios.setBackgroundImageForBarMetrics(
                        UIImage.new(),
                        UIBarMetrics.Default
                    );
                    actionBar.ios.translucent = true;
                };
            }
        }
    }


}
