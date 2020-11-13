import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
} from "@angular/core";
import { User } from "nativescript-plugin-firebase";
import * as firebaseCore from "nativescript-plugin-firebase";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";

import * as imagepicker from "nativescript-imagepicker";
import { isAndroid, isIOS } from "tns-core-modules/ui/page";
import * as fs from "tns-core-modules/file-system";
import { fromBase64, ImageSource } from "tns-core-modules/image-source";
import { MiscService } from "~/services/misc.service";
import { of } from "rxjs";
import { RouterExtensions } from "nativescript-angular";
import { LocalUser } from "~/models/user";

@Component({
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
    imageSrc: any = "~/assets/account.png";
    imageName: string;
    thumbSize: number = 80;
    previewSize: number = 300;

    isLoading: boolean = false;

    @ViewChild("profileImage", { static: true }) profileImage: ElementRef;

    isEditMode = false;

    localUser: LocalUser;

    imageChanged = false;

    constructor(
        public firebaseService: FirebaseService,
        private changeDetectorRef: ChangeDetectorRef,
        private miscService: MiscService,
        private routerExtention: RouterExtensions
    ) {
        this.currentUseGotten()
    }

    async edit(user: User) {
        // console.log("name",this.name);
        try {
            let that: this;

            let userId: any;
            this.isLoading = true;

            let newDownloadUrl = this.localUser.photoURL;

            if (this.imageChanged) {
                await firebase
                    .storage()
                    .ref()
                    .child(
                        `uploads/images/${this.localUser.displayName}-${this.localUser.uid}.jpg`
                    )
                    .delete()
                    .then(() => console.log("Deleted file"))
                    .catch((error) =>
                        console.log("Error deleting file: " + error)
                    );

                let imageSrc ;
                if(isAndroid){
                    imageSrc = this.imageSrc.replace("file://","");
                }else{
                }
                newDownloadUrl = await this.firebaseService
                    .uploadImage(
                        this.imageSrc,
                        `${this.localUser.displayName}-${this.localUser.uid}.jpg`,
                        imageSrc
                    )
                    .then((response) => response.downloadURL);

                this.localUser.photoURL = newDownloadUrl;
            }

            await firebase.auth().updateEmail(this.localUser.email);

            await firebase
                .firestore()
                .collection(this.firebaseService.collections.users)
                .doc(this.localUser.uid)
                .update(this.localUser);

            this.isLoading = false;
            this.isEditMode = false;
            
            this.resetCurrentUser();
        } catch (ex) {
            this.isLoading = false;
            this.miscService.alert("","").then(response=>{
                setTimeout(()=>{
                    this.firebaseService.signOut();
                });
            })
        }
    }

    public onSelectSingleTap() {
        let context = imagepicker.create({
            mode: "single",
        });
        this.startSelection(context);
    }

    private startSelection(context) {
        let that = this;

        context
            .authorize()
            .then(() => {
                // that.imageSrc = null;
                return context.present();
            })
            .then((selection) => {
                console.log("Selection done: " + JSON.stringify(selection));
                let selected = selection.length > 0 ? selection[0] : null;

                //if(selected){
                // selection.forEach(selected => {
                //     selected.getImage().then(imageSource=>{
                //         let folder = fs.knownFolders.documents();
                //         var path = fs.path.join(folder.path,`${this.name}.jpg`);
                //         var saved = imageSource.saveToFile(path,"jpg");
                //         this.imageSrc = path;
                //     })
                // });
                // }
                that.imageChanged = true;
                if (isAndroid) {
                    that.imageSrc = "file://"+ selected.android.toString();
                } else if (isIOS) {
                    const ios = selected.ios;
                    if (ios && ios.mediaType === PHAssetMediaType.Image) {
                        const opt = PHImageRequestOptions.new();
                        opt.version = PHImageRequestOptionsVersion.Current;
                        PHImageManager.defaultManager().requestImageDataForAssetOptionsResultHandler(
                            ios,
                            opt,
                            (
                                imageData: NSData,
                                dataUTI: string,
                                orientation: UIImageOrientation,
                                info: NSDictionary<any, any>
                            ) => {
                                //console.log("ImageDATA",imageData.base64Encoding());

                                console.log("Orientation", orientation);
                                this.imageSrc = ImageSource.fromBase64Sync(
                                    imageData.base64Encoding()
                                );

                                this.changeDetectorRef.detectChanges();
                                console.log("ImageSRC", this.imageSrc);
                                // objectForKey("PHImageFileURLKey").toString()
                            }
                        );
                    }
                }

                // set the images to be loaded from the assets with optimal sizes (optimize memory usage)
                // selection.forEach(function (element) {
                //     element.options.width =  that.previewSize;
                //     element.options.height = that.previewSize;
                // });
                this.changeDetectorRef.detectChanges();
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    switchToEditMode() {
        this.isEditMode = true;
    }

    currentUseGotten() {
        this.localUser = { ...this.firebaseService.currentUser };
        if (this.localUser.photoURL) 
        this.imageSrc = this.localUser.photoURL;
    }

    resetCurrentUser(){
        this.firebaseService.currentUser.displayName = this.localUser.displayName;
        this.firebaseService.currentUser.email = this.localUser.email;
        this.firebaseService.currentUser.phoneNumber = this.localUser.phoneNumber;
        this.firebaseService.currentUser.photoURL = this.localUser.photoURL;
    }
}
