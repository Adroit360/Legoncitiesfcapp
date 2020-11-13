import {
    Component,
    ElementRef,
    OnDestroy,
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

@Component({
    selector: "Search",
    templateUrl: "./radio.component.html",
})
export class RadioComponent implements OnInit, OnDestroy {
    isLoading = true;
    hasError: boolean = false;
    fullyLoaded: boolean = false;
    @ViewChild("webview", { static: true }) webView: ElementRef;
    _webView: WebViewExt;
    canGoBack = false;
    canGoForward = false;
    constructor() {}

    ngOnInit(): void {
        // Use the component constructor to inject providers.
        this._webView = <WebViewExt>this.webView.nativeElement;
        // if (isAndroid) {
        //     application.android.on(
        //         AndroidApplication.activityBackPressedEvent,
        //         (data: AndroidActivityBackPressedEventData) => {
        //             if (this.back()) {
        //                 data.cancel = true; // prevents default back button behavior
        //             }
        //         }
        //     );
        // }
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

    async onLoadFinished(event: any) {
        await this.wait(1000);

        this._webView.executeJavaScript(`
            
                    var play = document.getElementById("play");
                    let playIcon = document.querySelector("#play i");
                    let playText = document.querySelector("#play span");
        
                    var stop = document.getElementById("stop");
                    var stopIcon = document.querySelector("#stop i");
                    var stopText = document.querySelector("#stop span");
    
        
                    var error = document.getElementById("error");
                    var errorIcon = document.querySelector("#error i");
                    var errorText = document.querySelector("#error span");
        
                    play.style.position = 'fixed';
                    play.style.left = '0px';
                    play.style.top = '0px';
                    play.style.height = '100vh';
                    play.style.width = '100vh';
                    play.style['z-index'] = '99999';
                    play.style.backgroundColor = 'black';
                    play.style.backgroundImage = 'url(https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/others%2Fradio.jpeg?alt=media&token=ffc52ed1-b28d-4c69-8c6d-007c51619a09)';
                    play.style.backgroundPosition = 'center';
                    play.style.backgroundSize = 'cover';
                    

                    stop.style.position = 'fixed';
                    stop.style.left = '0px';
                    stop.style.top = '0px';
                    stop.style.height = '100vh';
                    stop.style.width = '100vh';
                    stop.style['z-index'] = '99999';
                    stop.style.backgroundColor = 'black';
                    stop.style.backgroundImage = 'url(https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/others%2Fradio.jpeg?alt=media&token=ffc52ed1-b28d-4c69-8c6d-007c51619a09)';
                    stop.style.backgroundPosition = 'center';
                    stop.style.backgroundSize = 'cover';
        
                  

        
                    error.style.position = 'fixed';
                    error.style.left = '0px';
                    error.style.top = '0px';
                    error.style.height = '100vh';
                    error.style.width = '100vh';
                    error.style['z-index'] = '99999';
                    error.style.backgroundColor = 'black';
                    error.style.backgroundImage = 'url(https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/others%2Fradio.jpeg?alt=media&token=ffc52ed1-b28d-4c69-8c6d-007c51619a09)';
                    error.style.backgroundPosition = 'center';
                    error.style.backgroundSize = 'cover';
        
                    playIcon.style.width = "35vw";
                    playIcon.style['text-align'] = "right";
                    playIcon.style['line-height'] = "100vh";
                    playIcon.style.color = '#fcd206';
                    playIcon.style.fontSize = '25px';
                    
                    playText.style.width = "65vw";
                    playText.style['text-align'] = "left";
                    playText.style.color = '#fcd206';
                    playText.style.fontSize = '25px';
        
                    stopIcon.style.width = "35vw";
                    stopIcon.style['text-align'] = "right";
                    stopIcon.style['line-height'] = "100vh";
                    stopIcon.style.color = '#fcd206';
                    stopIcon.style.fontSize = '25px';
        
                    stopText.style.width = "65vw";
                    stopText.style['text-align'] = "left";
                    stopText.style.color = '#fcd206';
                    stopText.style.fontSize = '25px';
        
                   
        
                    errorIcon.style.width = "35vw";
                    errorIcon.style['text-align'] = "right";
                    errorIcon.style['line-height'] = "100vh";
                    errorIcon.style.color = '#fcd206';
                    errorIcon.style.fontSize = '25px';
        
                    errorText.style.width = "65vw";
                    errorText.style['text-align'] = "left";
                    errorText.style.color = '#fcd206';
                    errorText.style.fontSize = '25px';

                var interval = setInterval(()=>{
                    try{
                        var loading = document.getElementById("loading");
                        var loadingIcon = document.querySelector("#loading i");
                        var loadingText = document.querySelector("#loading span");

                        loading.style.position = 'fixed';
                        loading.style.left = '0px';
                        loading.style.top = '0px';
                        loading.style.height = '100vh';
                        loading.style.width = '100vh';
                        loading.style['z-index'] = '99999';
                        loading.style.backgroundColor = 'black';
                        loading.style.backgroundImage = 'url(https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/others%2Fradio.jpeg?alt=media&token=ffc52ed1-b28d-4c69-8c6d-007c51619a09)';
                        loading.style.backgroundPosition = 'center';
                        loading.style.backgroundSize = 'cover';

                        loadingIcon.style.width = "35vw";
                        loadingIcon.style['text-align'] = "right";
                        loadingIcon.style['line-height'] = "100vh";
                        loadingIcon.style.color = '#fcd206';
                        loadingIcon.style.fontSize = '25px';
            
                        loadingText.style.width = "65vw";
                        loadingText.style['text-align'] = "left";
                        loadingText.style.color = '#fcd206';
                        loadingText.style.fontSize = '25px';

                    clearInterval(interval);

                    }catch(ex){

                    }
            },500);

          
        `);

        setTimeout(() => {
            this.isLoading = false;
        }, 1500);
        // this._webView.executeJavaScript(`
        // document.querySelector("header").style.display = "none";
        // document.getElementById("main_content").style['padding-top'] = "0px";

        // var m = setInterval(()=>{
        //     try{
        //         document.querySelector(".follow-bar").style.display = "none";
        //         document.querySelector(".control_bar_container").style.display = "flex";
        //         document.querySelector(".control_bar_container").style.justifyContent = "center";
        //         document.querySelector(".primary_link").style.display = "none";
        //         document.querySelector(".do-heart").parentElement.style.display = "none";
        //         document.querySelector(".do-share").parentElement.style.display = "none";
        //         clearInterval(m);
        //     }catch{

        //     }
        // },1000);
        //  `);
        console.log("Load Finished");

        // event.error
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

    ngOnDestroy() {
        // this._webView.src = "https://google.com";
        // this.webView = null;
    }

    wait(time: number = 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("");
            }, time);
        });
    }
}

// undefined
// document.querySelectorAll(".content-middle").forEach(item =>{
//     item.style.visibility = "collapse";
// });
// undefined
// document.querySelectorAll(".content-middle").forEach(item =>{
//     item.style.visibility = "visible";
// });
// undefined
// d5p.de17a.com/getuid/stickyads?:1 Failed to load resource: net::ERR_TIMED_OUT
