import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { WebViewExt } from "@nota/nativescript-webview-ext";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";
import { AndroidActivityBackPressedEventData, AndroidApplication, Application, Connectivity, isAndroid, WebView } from "@nativescript/core";

@Component({
    templateUrl: "./teams.component.html",
    styleUrls: ["./teams.component.scss", "../landing/landing.component.scss"],
})
export class TeamsComponent {
    // isLoading;
    webviewLoading = true;
    hasError: boolean = false;
    @ViewChild("webview", { static: true }) webView: ElementRef;
    _webView: WebViewExt;
    canGoBack = false;
    canGoForward = false;

    videoSrc;
    constructor(
        private firebaseService: FirebaseService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        firebase
            .firestore()
            .collection(this.firebaseService.collections.settings)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    let data = doc.data().livestreamframe;
                    this.videoSrc = data;
                });
            });
    }

    ngOnInit(): void {
        // Use the component constructor to inject providers.
        global['route'] = "home";
        this._webView = <WebViewExt>this.webView.nativeElement;
        if (isAndroid) {
            Application.android.on(
                AndroidApplication.activityBackPressedEvent,
                (data: AndroidActivityBackPressedEventData) => {
                    if (this.back()) {
                        data.cancel = true; // prevents default back button behavior
                    }
                }
            );
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer><any>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onLoadStarted(event) {
        this.webviewLoading = true;
        let webView = <WebView>this.webView.nativeElement;
        if (webView.android) {
            webView.android.getSettings().setBuiltInZoomControls(false);
            webView.android.getSettings().setDisplayZoomControls(false);
        }
    }

    onLoadFinished(event: any) {
        this.webviewLoading = false;
        this.changeDetectorRef.detectChanges();

        this._webView.executeJavaScript(`
                
                
                

                var interval = setInterval(()=>{
                    var a = document.querySelector(".ytp-chrome-top-buttons");

                    var b = document.querySelector(".ytp-youtube-button");
                    
                    var c = document.querySelector(".ytp-title-link");
                    
                    var d = document.querySelector(".ytp-button.ytp-expand");
                    
                    var e = document.querySelector(".ytp-pause-overlay");

                    var f = document.querySelector(".ytp-title-channel");

                    var g = document.querySelector(".ytp-title-text");

                    try{
                        var endscreen = document.querySelector(".html5-endscreen");
                        if(a)
                            a.remove();
                        if(b)
                            b.remove();
                        if(c)
                            c.removeAttribute("href");
                        if(d)
                            d.remove();
                        if(e)
                            e.remove();
                        if(f)
                            f.remove();
                        if(g)
                            g.style.transform = "translateX(-45px)";
                        if(endscreen){
                            endscreen.remove();
                            clearInterval(interval);
                        }
                    }catch(ex){

                    }
                 },500);
             `);

        // console.log("Load Finished",this.webviewLoading);
        //  this.webviewLoading = false;
        // event.error
        if (!this.checkConnection()) {
            this.hasError = true;
        } else {
            this.hasError = false;
            this.checkNavigationPossibilities(event.url);
        }

        this.changeDetectorRef.detectChanges();
    }

    back(): boolean {
        if (this.webView.nativeElement.canGoBack) {
            this._webView.goBack();
            return true;
        }
        return false;
    }

    forward() {
        if (this.webView.nativeElement.canGoForward) {
            this._webView.goForward();
            return true;
        }
        return false;
    }

    checkNavigationPossibilities(url: string) {
        if (this._webView) {
            if (this._webView.canGoBack) this.canGoBack = true;
            else this.canGoBack = false;

            if (this._webView.canGoForward) this.canGoForward = true;
            else this.canGoForward = false;
        }

        // if (url)
        //   this.route = Object.keys(this.urls).find(key => (url == this.urls[key] ));
    }

    reload() {
        //this.webView.nativeElement.src = this.urls[this.route];
        this._webView.reload();
    }

    // navigate(route) {
    //     this.isLoading = true;
    // }

    public checkConnection(): boolean {
        switch (Connectivity.getConnectionType()) {
            case Connectivity.connectionType.none:
                return false;
                break;
            case Connectivity.connectionType.wifi:
                return true;
                break;
            case Connectivity.connectionType.mobile:
                return true;
                break;
            default:
                return false;
                break;
        }
    }
}
