import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ContactComponent } from "./contact/contact.component";
import { HomeComponent } from "./home/home.component";
import { LandingComponent } from "./home/landing/landing.component";
import { NewsComponent } from "./home/news/news.component";
import { PlayersComponent } from "./home/players/players.component";
import { ProfileComponent } from "./profile/profile.component";
import { TeamsComponent } from "./home/teams/teams.component";
import { LeagueTableComponent } from "./leaguetable/leaguetable.component";
import { LoginComponent } from "./login/login.component";
import { RadioComponent } from "./radio/radio.component";
import { ChatComponent } from "./home/chat/chat.component";
import { BlogComponent } from "./home/blog/blog.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component:HomeComponent,children:[
        {path:"landing",component:LandingComponent,outlet:'landing'},
        {path:"fixtures",component:TeamsComponent,outlet:'fixtures'},
        {path:"players",component:PlayersComponent,outlet:'players'},
        {path:"news",component:BlogComponent,outlet:'news'},
        {path:"chat",component:ChatComponent,outlet:'chat'},
    ] },
    {path:"profile",component:ProfileComponent},
    {path:"radio",component:RadioComponent},
    {path:"login",loadChildren: () => import("~/app/login/login.module").then((m) => m.LoginModule)},
    {path:"signup",loadChildren: () => import("~/app/signup/signup.module").then((m) => m.SignUpModule)},
    { path: "theclub", loadChildren: () => import("~/app/theclub/theclub.module").then((m) => m.BrowseModule) },
    { path: "leaguetable", component:LeagueTableComponent },
    { path: "contact", component:ContactComponent},
    { path: "settings", loadChildren: () => import("~/app/setting/settings.module").then((m) => m.SettingsModule) }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
