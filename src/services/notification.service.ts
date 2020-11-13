import { RouterExtensions } from "nativescript-angular";
import { messaging, Message } from "nativescript-plugin-firebase/messaging";

export class NotificationService{

    constructor(private routerExtensions:RouterExtensions){
        console.log(`Notifications enabled? ${messaging.areNotificationsEnabled()}`);
        if(messaging.areNotificationsEnabled){
          this.registerForNotifications
        }
    }

    registerForNotifications(){
        messaging.registerForPushNotifications({
            onPushTokenReceivedCallback: (token: string): void => {
              console.log("Firebase plugin received a push token: " + token);
            },
          
            onMessageReceivedCallback: (message: Message) => {
              console.log("Push message received: " + message.title);
              
              if(message.foreground){

              }else{

              }
              
            },
          
            // Whether you want this plugin to automatically display the notifications or just notify the callback. Currently used on iOS only. Default true.
            showNotifications: true,
          
            // Whether you want this plugin to always handle the notifications when the app is in foreground. Currently used on iOS only. Default false.
            showNotificationsWhenInForeground: true
          }).then(() => console.log("Registered for push"));
    }

}