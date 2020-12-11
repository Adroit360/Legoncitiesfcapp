import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { FirebaseService } from "~/services/firebase.service";
import { MiscService } from "~/services/misc.service";

@Component({
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
    username:string;
    email: string;
    password: string;
    isLoading: boolean = false;
    constructor(
        private firebaseService: FirebaseService,
        private miscService: MiscService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: RouterExtensions
    ) {}

    ngOnInit(){
        global['route'] = "login";
    }

    async signIn() {
        this.isLoading = true;
        let that = this;

        if(this.username.trim().includes(" ")){
            this.miscService.alert("Invalid Usename","Username cannot contain spaces");
            return;
        }
        this.email = `${this.username.trim()}@gmail.com`;

        await this.firebaseService
            .signIn(this.email, this.password)
            .then(() => {
                return this.miscService.alert("success", "Login Successfull");
            }).then((a) => {
                this.isLoading = false;
                this.router.navigate(["home"]);
                // this.changeDetectorRef.detectChanges();
            }).catch((err) => {
                try{err.message = err.message.replace("email address","username");}catch(ex){};

                this.miscService.alert("falure", err.message);
                //console.log(err);
                this.isLoading = false;
            });
    }

}
