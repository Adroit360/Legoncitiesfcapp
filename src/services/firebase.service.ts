import { User } from "nativescript-plugin-firebase";
import * as firebaseCore from "nativescript-plugin-firebase";
import * as firebase from "nativescript-plugin-firebase/app";
import { auth } from "nativescript-plugin-firebase/app/auth";
import * as appStorage from "tns-core-modules/application-settings";
import { Observable } from "rxjs";
import * as fs from "tns-core-modules/file-system";
import { ImageSource } from "tns-core-modules/image-source";
import { MiscService } from "./misc.service";
import { LocalUser } from "~/models/user";

export class FirebaseService {
    currentUser? : LocalUser;
    storageKeys = {
        currrentUser: "current-user",
    };

    collections = {
        users:"users",
        chats:"chats",
        news:"news",
        teams:"teams",
        fixtures:"fixtures",
        settings:"settings",
        players:"players"
    }

    constructor(private miscService:MiscService) {
        this.monitorAuthStateChanges();
    }

    monitorAuthStateChanges() {
        firebase.auth().onAuthStateChanged(
            (user?: User) => {
                console.log(">> auth state changed: " + user);
                if (user) {
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(user.uid)
                        .get()
                        .then((doc) => {
                            console.log(doc.data());
                            this.currentUser = doc.data();
                            appStorage.setString(
                                this.storageKeys.currrentUser,
                                JSON.stringify(this.currentUser)
                            );
                        }).catch(this.checkIfLoggedIn);
                } else {
                    this.currentUser = null;
                    appStorage.remove(this.storageKeys.currrentUser);
                }
            },
            (error) => this.checkIfLoggedIn()
        );
    }

    checkIfLoggedIn() {
        let userString = appStorage.getString(this.storageKeys.currrentUser);
        if(userString){
            this.currentUser = JSON.parse(userString);
        }else{
            this.currentUser = null;
        }
    }

    signup(user: User, password: string) {
        console.log("name");

        firebase
            .auth()
            .createUserWithEmailAndPassword(user.email, password)
            .then((user) => {
                return firebaseCore
                    .updateProfile({
                        displayName: user.displayName,
                        photoURL:
                            "http://provider.com/profiles/eddyverbruggen.png",
                    })
                    .then(
                        function () {
                            // called when update profile was successful
                        },
                        function (errorMessage) {
                            console.log(errorMessage);
                        }
                    );
            });
    }

    // upload file
    private basePath = "profilePictures";
    uploadImage(data: ImageSource , imageName: string , imagePath = null) {
        const storageRef = firebase.storage().ref();
        const childRef = storageRef.child(`uploads/images/${imageName}`);

        // if you don't want/need to include metadata, pass in an empty object ({}) to avoid errors
        const metadata = {
            contentType: "image/jpg",
            contentLanguage: "en",
        };

        if(imagePath){
            return childRef.put(imagePath,metadata);
        }

        let folder = fs.knownFolders.documents();
        var path = fs.path.join(folder.path, `${imageName}.jpg`);
        var saved = data.saveToFile(path, "jpg");
        return childRef.put(path,metadata);
    }

    signIn(email,password){
        return firebase.auth().signInWithEmailAndPassword(email,password)
    }

    signOut(){
        firebase.auth().signOut();
        appStorage.remove(
            this.storageKeys.currrentUser
        );
    }
}
