import { RouterExtensions } from "nativescript-angular";
import { messaging, Message } from "nativescript-plugin-firebase/messaging";
import * as firebase from "nativescript-plugin-firebase/app";
import { UniversalService } from "./universal.service";

export class NotificationService{

    constructor(private routerExtensions:RouterExtensions,
        private universalService:UniversalService
      ){
        // console.log(`Notifications enabled? ${messaging.areNotificationsEnabled()}`);
        // if(messaging.areNotificationsEnabled){
        //   this.registerForNotifications
        // }
    }

    registerForNotifications(){
        messaging.subscribeToTopic("all").then(result=>{
          console.log(result);
        }).catch(err=>{
          console.log(err);
        });
        messaging.registerForPushNotifications({
            onPushTokenReceivedCallback: (token: string): void => {
              console.log("Firebase plugin received a push token: " + token);
            },
          
            onMessageReceivedCallback: (message: Message) => {
              console.log("Push message received: " + message.title);
              
              if(message.foreground){

              }else{
                try{
                  if(message.data.page == "home"){
                    if(this.universalService.homeTabView)
                    this.universalService.homeTabView.selectedIndex = message.data.tabViewIndex;  
                  }else if(message.data.page == "leaguetable"){
                    this.routerExtensions.navigate(['leaguetable']);
                  }else if(message.data.page == "radio"){
                    this.routerExtensions.navigate(['radio']);
                  }else{
                    if(this.universalService.homeTabView)
                    this.universalService.homeTabView.selectedIndex = 3;  
                  }
                }catch(ex){}
              }
              
            },
          
            // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
            showNotifications: true,
          
            // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
            showNotificationsWhenInForeground: true
          }).then(() => console.log("Registered for push"));
    }

}