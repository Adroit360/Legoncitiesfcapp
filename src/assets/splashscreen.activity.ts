import { isAndroid, ViewBase } from "tns-core-modules/ui/core/view-base";
import {
    AndroidActivityCallbacks,
    setActivityCallbacks,
} from "tns-core-modules/ui/frame";

@JavaProxy("com.tns.SplashScreenActivity")
class SplashScreenActivity extends androidx.appcompat.app.AppCompatActivity {
    public isNativeScriptActivity;
    private _callbacks: AndroidActivityCallbacks;

    private highlightedElement: ViewBase;

    onCreate(savedInstanceState: android.os.Bundle): void {
        this.isNativeScriptActivity = true;
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }
        this._callbacks.onCreate(
            this,
            savedInstanceState,
            this.getIntent(),
            super.onCreate
        );
    }

    public onSaveInstanceState(outState: android.os.Bundle): void {
        this._callbacks.onSaveInstanceState(
            this,
            outState,
            super.onSaveInstanceState
        );
    }

    public onStart(): void {
        this._callbacks.onStart(this, super.onStart);
    }

    public onStop(): void {
        this._callbacks.onStop(this, super.onStop);
    }

    public onDestroy(): void {
        this._callbacks.onDestroy(this, super.onDestroy);
    }

    public onBackPressed(): void {
        this._callbacks.onBackPressed(this, super.onBackPressed);
    }

    public onRequestPermissionsResult(
        requestCode: number,
        permissions: Array<string>,
        grantResults: Array<number>
    ): void {
        this._callbacks.onRequestPermissionsResult(
            this,
            requestCode,
            permissions,
            grantResults,
            undefined /*TODO: Enable if needed*/
        );
    }

    public onActivityResult(
        requestCode: number,
        resultCode: number,
        data: android.content.Intent
    ): void {
        this._callbacks.onActivityResult(
            this,
            requestCode,
            resultCode,
            data,
            super.onActivityResult
        );
    }

    public getDirectionPressed(event): number {
        console.log(event);
        return 0;
    }

    public onGenericMotionEvent(event): boolean {
        console.log(event);
        return true;
    }

    
    public dispatchKeyEvent(event: android.view.KeyEvent): boolean {
        // you can respond to specific keycodes by fi. registering a listener and invoking it when appropriate
        if (isAndroid) {

            
            try {

                // if(event == null){
                //     return true;
                //    // return super.dispatchKeyEvent(event);
                // }
                let keyCode = event.getKeyCode();
                let action = event.getAction();
                console.log("KeyCode",keyCode);
                if(keyCode == 4 && action == android.view.KeyEvent.ACTION_UP){
                    this.onBackPressed();
                    return false;
                }

                if(keyCode == 85 && action == android.view.KeyEvent.ACTION_DOWN){
                    

                    if(global["player"]){
                        let player = global["player"];
                        
                        if(global["playerPlaying"]){
                            global["playerPlaying"] = false;
                            player.pause();
                        }else{
                            global["playerPlaying"] = true;
                            player.play();
                        }
                    }
                    return false;
                }

                // let dpadCenter = android.view.KeyEvent.KEYCODE_DPAD_CENTER;

                // console.log(`Center code is ${dpadCenter}`);
                // console.log("D-Pad center button pressed? " +
                //         (event.getKeyCode() == dpadCenter)
                // );

                // let's highlight the element that currently has the focus

                let focusedElement = this.getCurrentFocus()["jsview"];

                // if(focusedElement == null){
                //     return true;
                //     //return super.dispatchKeyEvent(event);
                // }
                const tnsButton = <ViewBase>focusedElement;
                //console.log(tnsButton);
                // if(tnsButton == null){
                //     return true;
                //     //return super.dispatchKeyEvent(event);
                // }

                // if((event.getKeyCode() == dpadCenter)){
                //     console.log(tnsButton);
                // }

                if (tnsButton != this.highlightedElement) {
                    tnsButton.addPseudoClass("focused");

                    tnsButton.android.requestFocus();

                    

                    if (this.highlightedElement != null) {
                        this.highlightedElement.deletePseudoClass("focused");
                    }
                    this.highlightedElement = tnsButton;
                }
                let dispatch = super.dispatchKeyEvent(event);
                // console.log("DISPATCH", dispatch);
                if (dispatch != null) return dispatch;
                else return true;
            } catch (ex) {
                return true;
            }
        }
    }

    // public onKey(view, keyCode, event): boolean {
    //     switch (keyCode) {
    //         case android.view.KeyEvent.KEYCODE_ENTER:
    //             console.log("Yieee");
    //             /* This is a sample for handling the Enter button */
    //             return true;
    //     }
    //     return false;
    // }

    // public onKeyDown(keyCode, event: android.view.KeyEvent) {
    //     switch (keyCode) {
    //         case android.view.KeyEvent.KEYCODE_DPAD_LEFT:
    //             console.log("DPAD LEFT");
    //             break;
    //         case android.view.KeyEvent.KEYCODE_DPAD_RIGHT:
    //             console.log("DPAD RIGHT");
    //             break;
    //         case android.view.KeyEvent.KEYCODE_DPAD_DOWN:
    //             console.log("DPAD DOWN");
    //             break;
    //         case android.view.KeyEvent.KEYCODE_DPAD_UP:
    //             console.log("DPAD UP");
    //             break;
    //         case android.view.KeyEvent.KEYCODE_DPAD_CENTER:
    //             console.log("DPAD CENTER");
    //             break;
    //         case android.view.KeyEvent.KEYCODE_ENTER:
    //             console.log("DPAD ENTER");
    //         // fallthrough to default handling
    //     }
    //     return super.onKeyDown(keyCode, event);
    // }
}
