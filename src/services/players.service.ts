import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class PlayersService{
    
}

export class Player{
    name;
    number;
    image;
    role;
    constructor(){}
}
