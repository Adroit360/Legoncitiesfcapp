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
@Component({
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
    chatText: string;
    @ViewChild("chatTextBox", { static: true }) chatTextBox: ElementRef;
    @ViewChild("listView", { static: true }) listView: ElementRef<RadListView>;

    chatMessages: ChatMessage[] = [];
    hook;
    constructor(
        private misService: MiscService,
        private changeDetectorRef: ChangeDetectorRef,
        public firebaseService: FirebaseService
    ) {
        firebase
            .firestore()
            .collection(firebaseService.collections.chats)
            .orderBy("dateTime", "desc")
            .limit(200)
            .onSnapshot((snapshot) => {
                let messages = [];
                snapshot.docs.forEach((doc) => {
                    var data = <ChatMessage>doc.data();
                    if(this.chatMessages.filter(i=>i.id == data.id).length == 0){
                        messages.push(doc.data());
                    }
                });
                this.chatMessages = this.chatMessages.concat(messages.reverse());
                if (this.listView.nativeElement.getScrollOffset() < 5)
                    this.scrollToEnd();
            });
    }
    
    ngOnInit(){
        global['route'] = "home";
    }

    sendText() {
        let chatMessage = new ChatMessage({
            name: this.firebaseService.currentUser.displayName,
            photoURL: this.firebaseService.currentUser.photoURL,
            text: this.chatText,
            dateTime: new Date().toUTCString(),
            id:
                this.firebaseService.currentUser.email +
                new Date().toUTCString(),
        });

        console.log(this.listView.nativeElement.getScrollOffset());

        this.chatMessages.push({ ...chatMessage });
        this.scrollToEnd(1);
        this.changeDetectorRef.detectChanges();

        this.chatText = "";
        // return;
        firebase
            .firestore()
            .collection(this.firebaseService.collections.chats)
            .add(chatMessage)
            .then(() => {})
            .catch((err) => {
                this.misService.alert("error", err);
            });
    }

    scrollToEnd(minus = 0) {
        if (this.listView){
            let subtranct = this.listView.nativeElement.items.length == 0 ? 0 : 1;
            if(this.hook){
                this.listView.nativeElement.scrollToIndex(
                    this.listView.nativeElement.items.length - (subtranct + minus)
                );
            }
            this.hook = true;
        }
            
    }
}

class ChatMessage {
    name?: string;
    photoURL?: string;
    text?: string;
    dateTime: string;
    id: any;

    constructor(init?: Partial<ChatMessage>) {
        Object.assign(this, init);
    }
}
