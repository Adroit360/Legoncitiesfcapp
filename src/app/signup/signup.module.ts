import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "@nativescript/angular";
import { SharedModule } from "../shared/shared.module";
import { signupRoutingModule } from "./signup-routing-module";
import { signupComponent } from "./signup.component";

@NgModule({
    imports:[
        NativeScriptCommonModule,
        signupRoutingModule,
        SharedModule
    ],
    declarations:[
        signupComponent
    ],
    schemas:[
        NO_ERRORS_SCHEMA
    ]
})

export class SignUpModule {}
