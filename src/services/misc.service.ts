
import { Dialogs } from "@nativescript/core";
export class MiscService{


    alert(title, message) {
        return Dialogs.alert({
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

        return Dialogs.confirm(options);
    }

    openFile(filePath){
        
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