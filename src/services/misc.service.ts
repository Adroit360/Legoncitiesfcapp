import { alert, confirm } from "tns-core-modules/ui/dialogs/dialogs";

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
}