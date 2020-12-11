import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { firestore } from "nativescript-plugin-firebase";
import * as firebase from "nativescript-plugin-firebase/app";
import { RadListView } from "nativescript-ui-listview";
import { FirebaseService } from "~/services/firebase.service";
import { MiscService } from "~/services/misc.service";
import * as imagepicker from "nativescript-imagepicker";
import { of } from "rxjs";
import {
    Downloader,
    ProgressEventData,
    DownloadEventData,
} from "nativescript-downloader";
import { HandleFile } from "nativescript-handle-file";
import { ApplicationSettings, Utils, knownFolders, ImageSource, isAndroid, isIOS, ListView } from "@nativescript/core";
@Component({
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
    chatText: string;
    @ViewChild("chatTextBox", { static: true }) chatTextBox: ElementRef;
    @ViewChild("listView", { static: true }) listView: ElementRef<ListView>;

    ourId = 15;
    chatMessages: LocalChatMessage[] = [];
    hook;

    androidSelectedImageAsset;
    _fileSrc;

    downloader;

    public get fileSrc(): any {
        return this._fileSrc;
    }

    public set fileSrc(v: any) {
        if (v) this.imageHeight = 100;
        else this.imageHeight = 0;
        this._fileSrc = v;
    }

    imageHeight = 0;

    constructor(
        private misService: MiscService,
        private changeDetectorRef: ChangeDetectorRef,
        public firebaseService: FirebaseService
    ) {
        this.downloader = new Downloader();
        this.chatMessages = this.getLocalMessages();
        console.log(this.chatMessages);
        firebase
            .firestore()
            .collection(firebaseService.collections.chats)
            .orderBy("counter", "asc")
            .limit(200)
            .onSnapshot((snapshot) => {
                let messages = [];
                snapshot.docs.forEach((doc) => {
                    var data = <ChatMessage>doc.data();
                    if (
                        this.chatMessages.filter((i) => i.id == data.id)
                            .length == 0
                    ) {
                        messages.push(new LocalChatMessage(data));
                    }
                });
                this.chatMessages = this.chatMessages.concat(messages);
                this.persistLocalMessages();
                if (
                    this.listView.nativeElement &&
                    this.listView.nativeElement.items
                ) {
                    if (this.listView.nativeElement.items.length > 5)
                        this.scrollToEnd();
                }
            });
    }

    ngOnInit() {
        global["route"] = "home";
    }

    sendText() {
        if (!this.chatText && !this.fileSrc) return;

        let chatMessage = new ChatMessage({
            name: this.firebaseService.currentUser.displayName,
            photoURL: this.firebaseService.currentUser.photoURL,
            text: this.chatText,
            dateTime: new Date().toUTCString(),
            id:
                this.firebaseService.currentUser.email +
                new Date().toUTCString(),
            counter: this.getLastMessageCounter() + 1,
        });

        let pathSegments;
        let fileName;
        let scopedImageSrc;

        if (this.fileSrc) {
            pathSegments = this.fileSrc.split("/");
            fileName = pathSegments[pathSegments.length - 1];
            chatMessage.fileName = fileName;
            scopedImageSrc = this.fileSrc.replace("file://", "");
        }

        let localChatMessage = new LocalChatMessage(chatMessage);
        localChatMessage.localFileUrl = this.fileSrc;

        this.chatMessages.push(localChatMessage);

        this.persistLocalMessages();
        //clearText
        this.chatText = "";

        //Clear the image src

        this.fileSrc = null;

        this.firebaseService
            .uploadFile(scopedImageSrc, fileName)
            .catch((error) => {
                console.log("Error", error);
                return of({ downloadURL: "" }).toPromise();
            })
            .then((uploadedFile) => {
                chatMessage.fileUrl = uploadedFile.downloadURL;
                this.scrollToEnd();
                // this.changeDetectorRef.detectChanges();
                // return;
                firebase
                    .firestore()
                    .collection(this.firebaseService.collections.chats)
                    .add(chatMessage)
                    .then(() => {})
                    .catch((err) => {
                        this.misService.alert("error", err);
                    });
            });
    }

    attach() {
        this.onSelectSingleTap();
    }

    clearAttachment() {
        this.fileSrc = null;
    }

    scrollToEnd() {
        if (this.listView) {
            let position = this.listView.nativeElement.items.length;
            if (this.hook && position > 0) {
                this.listView.nativeElement.scrollToIndex(position);
            }
            this.hook = true;
        }
    }

    getLastMessageCounter(): number {
        let lastMessage = this.chatMessages[this.chatMessages.length - 1];
        if (lastMessage) return +lastMessage.counter;
        return 1;
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
                // that.fileSrc = null;
                return context.present();
            })
            .then(async (selection) => {
                //console.log("Selection done: " + JSON.stringify(selection));
                let selected = selection.length > 0 ? selection[0] : null;
                that.androidSelectedImageAsset = selected;

                if (isAndroid) {
                    //that.fileSrc = ImageSource.fromFile(selected.android.toString());
                    let path = selected.android.toString();
                    let imgSource = "file://" + path;
                    that.fileSrc = imgSource;
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
                                this.fileSrc = ImageSource.fromBase64Sync(
                                    imageData.base64Encoding()
                                );

                                this.changeDetectorRef.detectChanges();
                                console.log("ImageSRC", this.fileSrc);
                                // objectForKey("PHImageFileURLKey").toString()
                            }
                        );
                    }
                }
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    downloadFile(item: LocalChatMessage) {
        item.isBusy = true;
        // this.changeDetectorRef.detectChanges();
        console.log("downloadingItem", item.fileUrl);

        const downloader = this.downloader;

        let downloadMetadata;
        let filePath = knownFolders.documents().path;
        let fileName = this.misService.getFileName(item.fileUrl);
        if (isAndroid) {
            downloadMetadata = {
                url: item.fileUrl,
                path: filePath,
                fileName: fileName,
            };
        } else {
            downloadMetadata = {
                url: item.fileUrl,
                path: filePath,
                fileName: fileName,
            };
        }
        const imageDownloaderId = downloader.createDownload(downloadMetadata);
        try {
            downloader
                .start(imageDownloaderId, (progressData: ProgressEventData) => {
                    console.log(`Progress : ${progressData.value}%`);
                    console.log(`Current Size : ${progressData.currentSize}%`);
                    console.log(`Total Size : ${progressData.totalSize}%`);
                    console.log(
                        `Download Speed in bytes : ${progressData.speed}%`
                    );
                })
                .then((completed: DownloadEventData) => {
                    item.isBusy = false;
                    item.localFileUrl = completed.path;
                    this.changeDetectorRef.detectChanges();
                    console.log(`Image : ${completed.path}`);
                    this.persistLocalMessages();
                })
                .catch((error) => {
                    this.misService
                        .alert("Failed", "Download Failed")
                        .then(() => {
                            item.isBusy = false;
                            this.changeDetectorRef.detectChanges();
                            console.log(error.message);
                        });
                });
        } catch (ex) {
            this.misService.alert("Failed", "Download Failed").then(() => {
                item.isBusy = false;
                this.changeDetectorRef.detectChanges();
                console.log(ex);
            });
        }
    }

    openFile(fileUrl: string) {
        // let handleFile = new HandleFile();
        // fileUrl = "file://" +fileUrl;
        // if(!fileUrl)return;

        // if(!fileUrl.includes("file://")){
        //     fileUrl = "file://" + fileUrl;
        // }

        console.log("openFile", fileUrl);
        if (fileUrl) {
            if (fileUrl.includes("file://")) {
                Utils.openFile(fileUrl.replace("file://", ""));
            } else {
                let appDirectory = knownFolders.documents().path;
                //let file = appDirectory.getFile(`${splittedUrl[lt-2]}/${splittedUrl[lt-2]}`);
                Utils.openFile(
                    `${appDirectory}/${this.misService.getFileName(fileUrl)}`
                );
            }
        }
        //this.androidOpenFile(fileUrl);
    }

    persistLocalMessages() {
        new Promise((resolve, reject) => {
            ApplicationSettings.setString("chats", JSON.stringify(this.chatMessages));
        })
            .then()
            .catch();
    }

    getLocalMessages(): LocalChatMessage[] {
        try {
            let localChats = ApplicationSettings.getString("chats");
            let localChatMessages = JSON.parse(localChats);
            console.log("Local Chats", localChats);
            return localChatMessages;
        } catch (ex) {
            return [];
        }
    }
}

class ChatMessage {
    name?: string;
    photoURL?: string;
    text?: string;
    dateTime: string;
    id: any;
    counter: number;
    fileUrl: string;
    fileName: string;

    constructor(init?: Partial<ChatMessage>) {
        Object.assign(this, init);
    }
}

class OnlineChatMessage extends ChatMessage {
    constructor(init?: Partial<ChatMessage>) {
        super(init);
    }
}

class LocalChatMessage extends ChatMessage {
    constructor(init?: Partial<ChatMessage>) {
        super(init);
    }
    isDownloaded: boolean;
    localFileUrl: string;
    isBusy: boolean;
}
