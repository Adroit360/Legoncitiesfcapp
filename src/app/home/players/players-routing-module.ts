import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { PlayersComponent } from "./players.component";

const routes:Routes=[
    {
        path:"default",
        component: PlayersComponent
    },
]

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})

export class PlayersRoutingModule{}
