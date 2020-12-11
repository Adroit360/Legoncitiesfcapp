import { NgModule, NO_ERRORS_SCHEMA, OnInit } from "@angular/core";
import { NativeScriptHttpClientModule, RouterExtensions } from "nativescript-angular";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import { ItemService } from "~/services/items.service";
import { UniversalService } from "~/services/universal.service";
import { WebViewExtModule } from "@nota/nativescript-webview-ext/angular";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LandingComponent } from "./home/landing/landing.component";
import { NewsComponent } from "./home/news/news.component";
import { PlayersComponent } from "./home/players/players.component";
import { ProfileComponent } from "./profile/profile.component";
import { TeamsComponent } from "./home/teams/teams.component";
import { RadioComponent } from "./radio/radio.component";
import { SharedModule } from "./shared/shared.module";
import { LeagueTableComponent } from "./leaguetable/leaguetable.component";
import { ContactComponent } from "./contact/contact.component";

import * as firebaseCore from "nativescript-plugin-firebase";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";
import { MiscService } from "~/services/misc.service";
import { ChatComponent } from "./home/chat/chat.component";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { RouteReuseStrategy } from "@angular/router";
import { RouteStrategy } from "~/services/route-reuse.strategy";
import { NotificationService } from "~/services/notification.service";
import { BlogComponent } from "./home/blog/blog.component";
import { FileTypePipe } from "~/pipes/ismage.pipe";
import { Downloader } from 'nativescript-downloader';

// We can pass a configuration option here.
            firebaseCore
            .init({
                showNotifications: true,
                showNotificationsWhenInForeground: true,

                // onPushTokenReceivedCallback: (token) => {
                //     console.log("[Firebase] onPushTokenReceivedCallback:", {
                //         token,
                //     });
                // },

                // onMessageReceivedCallback: (message: firebaseCore.Message) => {
                //     console.log("[Firebase] onMessageReceivedCallback:", {
                //         message,
                //     });
                // },
            })
            .then(() => {
                console.log("[Firebase] Initialized");
            })
            .catch((error) => {
                console.log("[Firebase] Initialize", { error });
            });

// firebase.initializeApp({
//     storageBucket: "org.nativescript.legoncitiesfcapp",
// });



Downloader.init(); // <= Try calling this after the app launches to start the downloader service
// Downloader.setTimeout(120);


// somewhere at top of your component or bootstrap file
import {registerElement} from "nativescript-angular/element-registry";
registerElement("exoplayer", () => require("nativescript-exoplayer").Video);
@NgModule({
    bootstrap: [AppComponent],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        SharedModule,
        NativeScriptHttpClientModule,
        WebViewExtModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LandingComponent,
        TeamsComponent,
        PlayersComponent,
        TeamsComponent,
        ProfileComponent,
        BlogComponent,
        RadioComponent,
        LeagueTableComponent,
        ContactComponent,
        ChatComponent,
        FileTypePipe
    ],
    providers: [UniversalService,NotificationService, ItemService, FirebaseService, MiscService],
    schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule implements OnInit {
    constructor(private notificationService:NotificationService,
        private UniversalService:UniversalService){
        notificationService.registerForNotifications();
        UniversalService.registerBackPressedListener();
    }

    ngOnInit(){

    }
}
