import { Component, OnInit } from "@angular/core";
import { Player, PlayersService } from "~/services/players.service";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";

@Component({
    templateUrl: "./players.component.html",
    styleUrls: [
        "./players.component.scss",
        "../landing/landing.component.scss",
    ],
})
export class PlayersComponent implements OnInit {
    players: Array<Player>;

    indexedPlayers;

    init = `[{
        "name":"Fatau Dauda",
        "number": 12,
        "image": "https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FFatau%20Dauda.png?alt=media&token=0ea3e1de-e549-4788-a39d-9f3433ca412c",
        "role":"Goalkeeper"
    },
    {
        "name":"Winfred Honu",
        "number": 1,
        "image": "https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FHonu%20Winfred.png?alt=media&token=4c114649-d1bd-454b-8fd7-26063b179d15",
        "role":"GoalKeeper"
    },
    {
        "name":"Vincent Anane",
        "number": 30,
        "image": "https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FSylvester.png?alt=media&token=abb5e34c-397d-4c0c-9d95-c75be0326ea8",
        "role":"Goalkeeper"
    },
        {
            "name":"Micheal Ampadu",
            "number":5,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FAmpedu%20Micheal.png?alt=media&token=8740eee5-dd51-4c27-b7d5-c4195e6cef38",
            "role":"Defender"
        },
        {
            "name":"Romeo Oppong",
            "number":24,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FDaniel%20Romeo.png?alt=media&token=515c4b78-27a5-4b69-8ab8-db291cdc4615",
            "role":"Defender"
        },
        {
            "name":"Yusif Fadili",
            "number":7,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FYusif.png?alt=media&token=ea11143d-5408-4d4b-811b-222ae6704e5a",
            "role":"Defender"
        },
        {
            "name":"Nathaniel Akwa",
            "number":20,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FNat%20Akwah.png?alt=media&token=97130ccf-51ae-42f3-84be-dcb443dae874",
            "role":"Defender"
        },
        {
            "name":"Addo Francis Nuer",
            "number":17,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FAddo%20Francis.png?alt=media&token=a3f642de-ac1f-4eae-bea2-8347b2c86356",
            "role":"Defender"
        },
        {
            "name":"Suleman Mohammed",
            "number":4,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FMohammed%20Suleman.png?alt=media&token=ac13591d-e765-499f-968b-3388000d14a0",
            "role":"Defender"
        },
        {
            "name":"Jonas Anaya",
            "number":19,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FJones%20Aneiya.png?alt=media&token=3eb751aa-1981-4c56-8111-e1aa23eae106",
            "role":"Defender"
        },
        {
            "name":"Nicholas Mensah",
            "number": 6,
            "image":"",
            "role":"Defender"
        },
        {
            "name":"Vincent Adu Gyamfi",
            "number":26,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FVincent%20Adu%20Gyamfi.png?alt=media&token=911d1ad8-e841-4879-b2d6-8b8f3c29482b",
            "role":"Defender"
        },
        {
            "name":"Joseph Adjei",
            "number":28,
            "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FJoseph%20Adjei.png?alt=media&token=f7220c67-41c9-4985-b657-bef41a3d116e",
            "role":"Defender"
    },
    {
        "name":"Francis Addo",
        "number":17,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FAddo%20Francis.png?alt=media&token=a3f642de-ac1f-4eae-bea2-8347b2c86356",
        "role":"Defender"
    },
    
    
    {
        "name":"Jonah Attuquaye",
        "number":10,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FJonah%20Attuquaye.png?alt=media&token=b245a5b8-250d-4d7a-bf03-01cf1b2e37d4",
        "role":"Midfielder"
    },
    {
        "name":"Baba Mahama",
        "number":21,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FBaba%20Mahama.png?alt=media&token=fe071685-007f-45c8-8c3a-2e3b5fe582d1",
        "role":"Midfielder"
    },
    {
        "name":"Nicholas Gyan",
        "number":29,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FNicholas%20Gyan.png?alt=media&token=ac6e399e-91e5-4dc0-9bf1-0cbf5fb61421",
        "role":"Midfielder"
    },
    {
        "name":"Foster Ali Braimah",
        "number":23,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FFoster%20Braimah%20Ali.png?alt=media&token=8eaed6fa-485f-4c61-8f8a-54983fb0cc11",
        "role":"Midfielder"
    },
    {
        "name":"Abdul Nafiw Iddrisu",
        "number":8,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FNaffiw%20Iddrissu.png?alt=media&token=e33a1ab9-fdc8-4693-96fe-6d360deed826",
        "role":"Midfielder"
    },
    {
        "name":"Karim Jabilla",
        "number":2,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FKarim%20Abdul.png?alt=media&token=1a006c90-6e63-4910-807a-bec0945690f5",
        "role":"Midfielder"
    },
    {
        "name":"Elvis Opoku",
        "number":14,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FElvis%20Opoku.png?alt=media&token=433ccc4d-62a1-4601-9d3c-dde822127b9d",
        "role":"Midfielder"
    },
    {
        "name":"Benjamin Adjei",
        "number":15,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FBenjamin%20Adjei.png?alt=media&token=7ed5e1ef-e0fc-45d3-bdf9-4e1dc9ae18b5"
    },
    {
        "name":"Nasiru Moro",
        "number":27,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FMoro%20Yusif.png?alt=media&token=7f68bea6-b6c4-4bc9-949a-5bcb288b325e",
        "role":"Midfielder"
    },
    {
        "name":"Yakubu Mohammed",
        "number":11,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FYakubu%20Mohammed.png?alt=media&token=d8fc7c82-b8a8-4e52-8401-0883d1aa19e0",
        "role":"Midfielder"
    },
    {
        "name":"Asomoah Gyan",
        "number":3,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FAsamoah%20Gyan.png?alt=media&token=27e69f65-b074-461e-b213-c63aff14f49d",
        "role":"Attack"
    },
    {
        "name":"Raphael Ocloo",
        "number":9,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FRaphael%20Ocloo.png?alt=media&token=6e3734c2-e209-4e95-880b-c2e7118460e9",
        "role":"Attack"
    },
    {
        "name":"Mathew Anim Cudjoe",
        "number":16,
        "image":"",
        "role":"Attack"
    },
    {
        "name":"David Cudjoe",
        "number":22,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FDavid%20Cudjoe.png?alt=media&token=0ff15600-0c1a-440f-9465-b30372e812c2",
        "role":"Attack"
    },
    {
        "name":"Cephas Doku",
        "number":18,
        "image":"https://firebasestorage.googleapis.com/v0/b/legoncitiesfcapp.appspot.com/o/players%2FCephas%20Doku.png?alt=media&token=779aebc3-7555-48ac-9e3f-d1ab1ea5eff0",
        "role":"Attack"
    }
    ]`;

    objectKeys = Object.keys;
    constructor(
        private _playersService: PlayersService,
        private firebaseService: FirebaseService
    ) {
       
    }

    ngOnInit(): void {
        global['route'] = "home";
        firebase
            .firestore()
            .collection(this.firebaseService.collections.players)
            .get()
            .then((docs) => {
                this.players = [];
                this.indexedPlayers = {};
                let tempIndexedPlayers = {}
                docs.forEach((doc) => {
                    let player = <Player>doc.data();
                    this.players.push(player);
                    
                    if(!tempIndexedPlayers[player.role]){
                        tempIndexedPlayers[player.role] = []
                    }
                    tempIndexedPlayers[player.role].push(player);
                });
                this.indexedPlayers = tempIndexedPlayers;
                // console.log(this.indexedPlayers)
            });
    }

    uploadInitial() {
        return;
        let initiaPlayers = <[]>JSON.parse(this.init);
        for (let player of initiaPlayers) {
            firebase
                .firestore()
                .collection(this.firebaseService.collections.players)
                .add(player)
                .then((response) => {
                    console.log("UPLOADING PLAYERS...");
                    console.log(response);
                });
        }
    }
}
