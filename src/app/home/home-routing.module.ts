import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";
import { LandingComponent } from "./landing/landing.component";
import { NewsComponent } from "./news/news.component";
import { PlayersComponent } from "./players/players.component";
import { ProfileComponent } from "../profile/profile.component";
import { TeamsComponent } from "./teams/teams.component";

const routes: Routes = [
    { path: "", component: HomeComponent,children:[
        
    ] }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
