import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/ui/page";
import { WebView } from "tns-core-modules/ui/web-view";
import {
    AndroidApplication,
    AndroidActivityBackPressedEventData,
} from "tns-core-modules/application";
import * as connectivity from "tns-core-modules/connectivity";
import * as application from "tns-core-modules/application";
import { WebViewExt } from "@nota/nativescript-webview-ext";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";

@Component({
    templateUrl: "./blog.component.html",
    styleUrls: ["./blog.component.scss", "../landing/landing.component.scss"],
})
export class BlogComponent {
    // isLoading;
    webviewLoading = true;
    hasError: boolean = false;
    @ViewChild("webview", { static: true }) webView: ElementRef;
    _webView: WebViewExt;
    canGoBack = false;
    canGoForward = false;

    videoSrc = "https://legoncities.com/blog/";
    constructor(
        private firebaseService: FirebaseService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        // Use the component constructor to inject providers.
        global['route'] = "home";
        this._webView = <WebViewExt>this.webView.nativeElement;
        if (isAndroid) {
            application.android.on(
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
        const sideDrawer = <RadSideDrawer>app.getRootView();
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
                
             `);

        if (this._webView.canGoBack) {
            this.canGoBack = true;
        } else {
            this.canGoBack = false;
        }

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
            this.webviewLoading = true;
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
        switch (connectivity.getConnectionType()) {
            case connectivity.connectionType.none:
                return false;
                break;
            case connectivity.connectionType.wifi:
                return true;
                break;
            case connectivity.connectionType.mobile:
                return true;
                break;
            default:
                return false;
                break;
        }
    }
}
