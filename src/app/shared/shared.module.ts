import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ItemService } from "~/services/items.service";
import { UniversalService } from "~/services/universal.service";
import { CustomActionBarComponent } from "./action-bar/action-bar.component";

@NgModule({
    declarations:[
        CustomActionBarComponent,
    ],
    imports:[
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule
    ],
    exports:[
        CustomActionBarComponent,
        NativeScriptFormsModule,
        NativeScriptRouterModule
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SharedModule{

}