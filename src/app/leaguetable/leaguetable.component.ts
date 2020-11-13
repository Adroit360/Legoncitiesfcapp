import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
// import * as js from "./leaguetable.injection.js";

@Component({
    selector: "leaguetable",
    templateUrl: "./leaguetable.component.html"
})
export class LeagueTableComponent implements OnInit {

    isLoading = true;
    hasError: boolean = false;
    @ViewChild("webview", { static: true }) webView: ElementRef;
    _webView: WebViewExt;
    canGoBack = false;
    canGoForward = false;
    constructor() {}

    ngOnInit(): void {
        // Use the component constructor to inject providers.
        global['route'] = "leaguetable";
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

        // this._webView.inje
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onLoadStarted(event) {
        this.isLoading = true;
        let webView = <WebView>this.webView.nativeElement;
        if (webView.android) {
            webView.android.getSettings().setBuiltInZoomControls(false);
            webView.android.getSettings().setDisplayZoomControls(false);
        }
    }

    onLoadFinished(event: any) {
        
        // event.error
     this._webView.executeJavaScript(`document.querySelectorAll("div[title =' - Legon Cities']").forEach(element => {
                                         element.parentElement.style.backgroundColor = "pink"
                                      });
                                      document.querySelector(".embed-download-box").style.display = 'none';
                                      document.querySelector(".u-fs15").style.display = 'block';
                                      document.querySelector(".u-fs15").style.textAlign = 'center';
                                      `);
        this.isLoading = false;
        if (!this.checkConnection()) {
            this.hasError = true;
        } else {
            this.hasError = false;
            this.checkNavigationPossibilities(event.url);
        }
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

    navigate(route) {
        this.isLoading = true;
    }

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
