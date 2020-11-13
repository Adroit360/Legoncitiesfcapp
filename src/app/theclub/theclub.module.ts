import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TheClubRoutingModule } from "./theclub-routing.module";
import { TheClubComponent } from "./theclub.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        TheClubRoutingModule
    ],
    declarations: [
        TheClubComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class BrowseModule { }
