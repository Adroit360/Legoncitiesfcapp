import { Injectable } from "@angular/core";

@Injectable()
export class ItemService {
    private items = new Array<Item>(
        {   id:1,
            awayImage: "https://www.sportsbase.io/images/clubs/17155.png",
            homeImage: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Legon_Cities_FC.png/220px-Legon_Cities_FC.png",
        },
        {   id:2,
            awayImage: "https://upload.wikimedia.org/wikipedia/en/f/fd/Asante_Kotoko_SC_%28logo%29.png",
            homeImage: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Legon_Cities_FC.png/220px-Legon_Cities_FC.png",
        }
    );

    getItems(): Array<Item> {
        return this.items;
    }

    getItem(id: number): Item {
        return this.items.filter((item) => item.id === id)[0];
    }
}


export class Item {
    constructor(public id: number, public awayImage: string, public homeImage: string) { }
}