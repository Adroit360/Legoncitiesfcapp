import { alert, confirm } from "tns-core-modules/ui/dialogs/dialogs";

import * as application from "tns-core-modules/application";
import * as fs from 'tns-core-modules/file-system';
export class MiscService{


    alert(title, message) {
        return alert({
            title: title,
            message: message,
            okButtonText: "OK",
        });
    }

    confirm(title, message) {
        let options = {
            title,
            message,
            okButtonText: "Yes",
            cancelButtonText: "No",
        };

        return confirm(options);
    }

    openFile(filePath){
        // try {
        //     let intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
        //     let mimeType = this.findExtension(file.extension);  // The file here is the nativescript file object (fs.File)
        //     let context = application.android.currentContext;
        //     let nativeFile = new java.io.File(file.path);
        //     let uri = android.support.v4.content.FileProvider.getUriForFile(context, 'org.adroit360gh.legoncitiesfc.provider', nativeFile); // Here add ".provider" after your app package name
        //     intent.setDataAndType(uri, mimeType);
        //     intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        //     application.android.currentContext.startActivity(android.content.Intent.createChooser(intent, 'Open File...'));
        
        // } catch (e) {
        //     console.log(e);
        // }
    }

    getFileName(fileUrl:string):string{
        let splittedUrl = fileUrl.split("/");
        if(splittedUrl.length > 0){
            let rawPath = splittedUrl[splittedUrl.length -1];
            if(rawPath.includes("?")){
                let tempPath = rawPath.split("?")[0];
                if(tempPath.includes("%2")){
                    let splittedTemp =  tempPath.split("%2");
                    return splittedTemp[splittedTemp.length -1];
                }
                return tempPath;
            }
            return rawPath;
        }
        return "";
    }
}