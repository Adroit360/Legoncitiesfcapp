import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

@Component({
    selector: "theclub",
    templateUrl: "./theclub.component.html",
    styleUrls:["./theclub.component.scss"]
})
export class TheClubComponent implements OnInit {
    m = {};
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        global['route'] = "theclub";
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
