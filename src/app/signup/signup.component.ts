import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
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
import * as fileSystemModule from "tns-core-modules/file-system";
import { Image } from "tns-core-modules/ui/image";

@Component({
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"],
})
export class signupComponent implements OnInit{
    name: string;
    email: string;
    jerseyNumber: string;
    phoneNumber: string;
    password: string;
    localImage = "~/assets/account.png";

    imageSrc: any = "~/assets/account.png";
    imageName: string;
    thumbSize: number = 80;
    previewSize: number = 300;

    isLoading: boolean = false;

    androidSelectedImageAsset;

    @ViewChild("profileImage", { static: true }) profileImage: ElementRef<
        Image
    >;

    constructor(
        private firebaseService: FirebaseService,
        private changeDetectorRef: ChangeDetectorRef,
        private miscService: MiscService,
        private routerExtention: RouterExtensions
    ) {
        
    }

    ngOnInit(){
        global['route'] = "signup";
    }

    signup(user: User) {
        // console.log("name",this.name);

        if(this.name.trim().includes(" ")){
            this.miscService.alert("Invalid Usename","Username cannot contain spaces");
            return;
        }

        let that = this;
        this.email = `${this.name.trim()}@gmail.com`;
        let userId: any;
        this.isLoading = true;
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.email, this.password)
            .then((response) => {
                userId = response.uid;

                if (this.imageSrc == this.localImage) {
                    return of({ downloadURL: "" }).toPromise();
                } else {
                    if (isAndroid) {
                        // ImageSource.fromFile("file:///storage/emulated/0/Download/OFF. TMAG NEW .jpg")
                        // .then((imgSrc) => {
                            let imageSrc = this.imageSrc.replace("file://","");
                        return (
                            this.firebaseService
                                .uploadImage(
                                    null,
                                    `${this.name}-${userId}.jpg`,
                                    imageSrc,
                                )
                                // })
                                .catch((error) => {
                                    return of({ downloadURL: "" }).toPromise();
                            })
                        );
                    }
                    if (isIOS) {
                        return this.firebaseService.uploadImage(
                            this.imageSrc,
                            `${this.name}-${userId}.jpg`
                        );
                    }
                }
            })
            .then((uploadedImage) => {
                console.log("Uploaded Image", uploadedImage);
                let opt: firebaseCore.UpdateProfileOptions;
                return firebase
                    .firestore()
                    .collection(this.firebaseService.collections.users)
                    .doc(userId)
                    .set(
                        new LocalUser({
                            uid: userId,
                            displayName: this.name,
                            photoURL: uploadedImage.downloadURL,
                            phoneNumber: this.phoneNumber,
                            email: this.email,
                        })
                    );
            })
            .then((updateProfileResult) => {
                that.routerExtention.navigate(["home"]);
                this.firebaseService.signIn(this.email, this.password);
                that.miscService.alert("success", "Registeration Successfull");
                that.isLoading = false;
            })
            .catch((error) => {
                try{error = error.replace("email address","username");}catch(ex){};
                that.miscService.alert("info", error);
                that.isLoading = false;
            });
    }

    onDateChanged(args) {
        console.log("Date New value: " + args.value);
        console.log("Date value: " + args.oldValue);
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
            .then(async (selection) => {
                //console.log("Selection done: " + JSON.stringify(selection));
                let selected = selection.length > 0 ? selection[0] : null;
                that.androidSelectedImageAsset = selected;
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

                if (isAndroid) {
                    //that.imageSrc = ImageSource.fromFile(selected.android.toString());
                    let path = selected.android.toString();
                    let imgSource = "file://" + path;
                    that.imageSrc = imgSource;
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
            })
            .catch(function (e) {
                console.log(e);
            });
    }
}

// const opt = PHVideoRequestOptions.new();
// opt.version = PHVideoRequestOptionsVersion.Current;
// PHImageManager.defaultManager().requestAVAssetForVideoOptionsResultHandler(
//   ios, opt, (asset: AVAsset, audioMix: AVAudioMix, info: NSDictionary<any, any>) => {
//     let regex = /(file[^>]*)/g
//     let file = asset.toString().match(regex)[0];
//     console.log(file);
//   });
// }
