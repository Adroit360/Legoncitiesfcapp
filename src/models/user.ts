export class LocalUser {
    uid?: string;
    displayName?: string;
    photoURL?: string;
    phoneNumber?: string;
    email?: string;

    constructor(init?:Partial<LocalUser>){
        Object.assign(this,init);
    }
}
