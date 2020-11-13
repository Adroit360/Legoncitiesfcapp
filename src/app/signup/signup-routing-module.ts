import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";
import { signupComponent } from "./signup.component";

const routes:Routes = [{
    path: "",
    component: signupComponent
}]

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class signupRoutingModule {}
