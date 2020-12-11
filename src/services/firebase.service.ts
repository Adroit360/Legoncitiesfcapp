import { User } from "nativescript-plugin-firebase";
import * as firebaseCore from "nativescript-plugin-firebase";
import * as firebase from "nativescript-plugin-firebase/app";
import { auth } from "nativescript-plugin-firebase/app/auth";

import { MiscService } from "./misc.service";
import { LocalUser } from "~/models/user";
import { OnInit } from "@angular/core";
import { path, ApplicationSettings, ImageSource, knownFolders } from "@nativescript/core";

export class FirebaseService implements OnInit {
    currentUser?: LocalUser;
    storageKeys = {
        currrentUser: "current-user",
        credentials: "credentials",
    };

    collections = {
        users: "users",
        chats: "chats",
        news: "news",
        teams: "teams",
        fixtures: "fixtures",
        settings: "settings",
        players: "players",
    };

    constructor(private miscService: MiscService) {
        this.monitorAuthStateChanges();

        try {
            let cred: { email; password } = JSON.parse(
                ApplicationSettings.getString(this.storageKeys.credentials)
            );

            if (cred) {
                this.signIn(cred.email, cred.password);
            }
        } catch (ex) {}
    }

    ngOnInit() {}

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
                            ApplicationSettings.setString(
                                this.storageKeys.currrentUser,
                                JSON.stringify(this.currentUser)
                            );
                        })
                        .catch(this.checkIfLoggedIn);
                } else {
                    this.currentUser = null;
                    ApplicationSettings.remove(this.storageKeys.currrentUser);
                }
            },
            (error) => this.checkIfLoggedIn()
        );
    }

    checkIfLoggedIn() {
        let userString = ApplicationSettings.getString(this.storageKeys.currrentUser);
        if (userString) {
            this.currentUser = JSON.parse(userString);
        } else {
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
    uploadImage(data: ImageSource, imageName: string, imagePath = null) {
        const storageRef = firebase.storage().ref();
        const childRef = storageRef.child(`uploads/images/${imageName}`);

        // if you don't want/need to include metadata, pass in an empty object ({}) to avoid errors
        const metadata = {
            contentType: "image/jpg",
            contentLanguage: "en",
        };

        if (imagePath) {
            return childRef.put(imagePath, metadata);
        }

        let folder = knownFolders.documents();
        var _path = path.join(folder.path, `${imageName}.jpg`);
        var saved = data.saveToFile(_path, "jpg");
        return childRef.put(_path);
    }

    uploadFile(filePath: string, fileName: string) {
        const storageRef = firebase.storage().ref();
        const childRef = storageRef.child(`uploads/chatfiles/${fileName}`);

        // if you don't want/need to include metadata, pass in an empty object ({}) to avoid errors
        return childRef.put(filePath, {});
    }

    signIn(email, password) {
        ApplicationSettings.setString(
            this.storageKeys.credentials,
            JSON.stringify({ email, password })
        );
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    signOut() {
        firebase.auth().signOut();
        ApplicationSettings.remove(this.storageKeys.currrentUser);
        ApplicationSettings.remove(this.storageKeys.credentials);
    }

   
}
