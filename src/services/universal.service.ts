import { HttpClient } from "@angular/common/http";
import { Injectable, ViewContainerRef } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import * as permissions from "nativescript-permissions";
import * as TNSPhone from 'nativescript-phone';
import { isAndroid } from "tns-core-modules/ui/page";
declare var android;
import {
    AndroidApplication,
    AndroidActivityBackPressedEventData,
} from "tns-core-modules/application";
import * as application from "tns-core-modules/application";
import { exit } from "nativescript-exit";
import { Router } from "@angular/router";
import { MiscService } from "./misc.service";
import { TabView } from "tns-core-modules/ui/tab-view";

@Injectable()
export class UniversalService{
    private sideDrawer:RadSideDrawerComponent;
    rootViewContainerRef:ViewContainerRef;

    homeTabView:TabView;

    constructor(private httpClient:HttpClient,
        private miscService:MiscService,
        private router:Router) {
       
    }

    toggleDrawer(){
        if(this.sideDrawer){
            this.sideDrawer.nativeElement.showDrawer()
        }
    }

    setSideDrawer(sideDrawer:RadSideDrawerComponent){
        this.sideDrawer = sideDrawer;
    }

    buyTicket(){
        this.dialNumber("*968#");
    }

    public dialNumber(number) {
        if(isAndroid){
            permissions.requestPermission(android.Manifest.permission.CALL_PHONE, 
                                    "App Needs This Permission To Make Phone Calls")
            .then(()=>{
                TNSPhone.dial(number, false);
            })
            .catch(()=>{
                console.log("Permission Denied!");
            });
            
        }else{
            console.log("Dialing ...1 ");
            TNSPhone.dial(number, false);
        }
        // permissions.requestPermission(android.Manifest.permission.CALL_PHONE, 
        //                             "App Needs This Permission To Make Phone Calls")
        //     .then(()=>{
        //         console.log("Got Permission!");
        //         console.log(number);
        //         TNSPhone.dial(String(number), false);
        //     })
        //     .catch(()=>{
        //         console.log("Permission Denied!");
        //     });
    }

    showExitPopup() {
        this.miscService
            .confirm(
                "Exit Application",
                "Are you sure you want to exit the application"
            )
            .then((result) => {
                if (result) {
                    exit();
                }
            });
    }

    registerBackPressedListener(){
        if (isAndroid) {
            application.android.on(
                AndroidApplication.activityBackPressedEvent,
                (data: AndroidActivityBackPressedEventData) => {
                    if (this.router.isActive("/home", false)) {
                        data.cancel = true; // prevents default back button behavior
                        this.showExitPopup();
                    }
                }
            );
        }
    }
}