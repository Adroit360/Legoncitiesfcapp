import { Component, OnInit } from "@angular/core";
import { Application } from "@nativescript/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";

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
        const sideDrawer = <RadSideDrawer><any>Application.getRootView();
        sideDrawer.showDrawer();
    }
}
