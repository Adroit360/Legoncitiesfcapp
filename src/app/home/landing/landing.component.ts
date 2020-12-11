import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Team } from "~/models/team";
import { Item, ItemService } from "~/services/items.service";
import { UniversalService } from "~/services/universal.service";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";
import { of } from "rxjs";
import { Fixture } from "~/models/fixture";
import { Application, Page } from "@nativescript/core";

@Component({
    selector: "app-landing",
    templateUrl: "./landing.component.html",
    styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
    initTeams = `[{
        "name":"Great Olympics",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_187198.png",
        "id": 1
      },
      {
        "name":"Aduanna Stars",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_42610.png",
        "id": 2
      },
      {
        "name":"Asante Kotoko",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_41755.png",
        "id": 3
      },
      {
        "name":"Bechem United",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_115787.png",
        "id": 4
      },
      {
        "name":"Ashanti Gold FC",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_81945.png",
        "id": 5
      },
      {
        "name":"Berekum Chelsea",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_42611.png",
        "id": 6
      },
      {
        "name":"Dreams",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_213969.png",
        "id": 7
      },
      {
        "name":"Ebusua Dwarfs",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_81947.png",
        "id": 8
      },
      {
        "name":"Eleven Wonders",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_274972.png",
        "id": 9
      },
      {
        "name":"Elmina Sharks",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_221711.png",
        "id": 10
      },
      {
        "name":"Accra Hearts Of Oak",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_42614.png",
        "id": 11
      },
      {
        "name":"Inter Allies",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_115789.png",
        "id": 12
      },
      {
        "name":"Karela United",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_274973.png",
        "id": 13
      },
      {
        "name":"King Faisal",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_81949.png",
        "id": 14
      },
      {
        "name":"Legon Cities",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_81943.png",
        "id": 15
      },
      {
        "name":"Liberty",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_42615.png",
        "id": 16
      },
      {
        "name":"Medeama",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_81951.png",
        "id": 17
      },
      {
        "name":"WAFA",
        "logoUrl":"https://www.sofascore.com/images/team-logo/football_187200.png",
        "id": 18
      }]
      `;

    teams: Team[] = [];

    indexedTeams;

    initFixtures = `[{
  
        "homeTeam":"15",
        "awayTeam":"6",
        "date":"14th November 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"1",
        "awayTeam":"15",
        "date":"20th November 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"15",
        "awayTeam":"17",
        "date":"27th November 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"7",
        "awayTeam":"15",
        "date":"02 December 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"3",
        "awayTeam":"",
        "date":"11th December 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"15",
        "awayTeam":"8",
        "date":"18th December 2020",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"16",
        "awayTeam":"15",
        "date":"1st January 2021",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"18",
        "awayTeam":"15",
        "date":"15th January 2021",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"2",
        "awayTeam":"15",
        "date":"15th January 2021",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"15",
        "awayTeam":"5",
        "date":"22 January 2021",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"15",
        "awayTeam":"5",
        "date":"22 January 2021",
        "homeScore":"",
        "awayScore":""
      },
      {
        
        "homeTeam":"15",
        "awayTeam":"13",
        "date":"22 January 2021",
        "homeScore":"",
        "awayScore":""
      }]
      `;

    m = {};
    items: Array<Item>;

    fixtures: Fixture[] = [];

    upcomingFixtures: Fixture[] = [];

    oldfixtures: Fixture[] = [];

    ourId:string = "15";

    @ViewChild("reloadLabel", { static: true }) reloadLabel: ElementRef;

    rotating:boolean;

    constructor(
        private _itemService: ItemService,
        public firebaseService: FirebaseService,
        private universalService: UniversalService,
        private changeDetectorRef: ChangeDetectorRef,
        private page: Page
    ) {
        // Use the component constructor to inject providers.
        // this.page.actionBar.title = "Home";
    }

    ngOnInit(): void {
        // Init your component properties here.
        global['route'] = "home";
        this.items = this._itemService.getItems();

        //console.log("Testing Dates",new Date("20 November 2020").getDate());
        // console.log(this.items)
        //return;
        firebase
            .firestore()
            .collection(this.firebaseService.collections.teams)
            .onSnapshot((snapshot) => {
              this.teams = [];
              let tempIndexedTeams = {};
              snapshot.docs.forEach((doc) => {
                  let data = <Team>doc.data();
                  this.teams.push(data);
                  tempIndexedTeams[data.id] = data;
              });
              this.indexedTeams = tempIndexedTeams;
          });

        firebase
            .firestore()
            .collection(this.firebaseService.collections.fixtures)
            .onSnapshot((snapshot) => {
              this.manipulateFixtureDocs(snapshot.docs)
            });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer><any>Application.getRootView();
        sideDrawer.showDrawer();
    }

    uploadInitial() {
        //Was used to upload Initial Fixtures
        return;
        let initial = <[]>JSON.parse(this.initFixtures);
        for (let init of initial) {
            firebase
                .firestore()
                .collection(this.firebaseService.collections.fixtures)
                .add(init)
                .then((response) => {
                    console.log(response);
                });
        }
    }

    buyTickets() {
        //console.log("Buying tickets ..........");
        this.universalService.buyTicket();
    }


    manipulateFixtureDocs(docs){
      this.fixtures = [];
      docs.forEach((doc) => {
          this.fixtures.push(<Fixture>doc.data());
      });

      // console.log("Raw Fixtures", this.fixtures);

      this.upcomingFixtures = this.fixtures.filter((i) => {
          let _a = i.date.split("-");

          let date = new Date(
              parseInt(_a[0]),
              parseInt(_a[1]) - 1,
              parseInt(_a[2])
          ).getTime();
            let today = new Date();
            today.setDate(today.getDate() - 1);
            return date - today.getTime() > 0;
      });

      this.upcomingFixtures.sort((a, b) => {
          let _a = a.date.split("-");
          let aDate = new Date(
              parseInt(_a[0]),
              parseInt(_a[1]) - 1,
              parseInt(_a[2])
          ).getTime();
          //console.log("aDate",a.date,new Date(aDate).toISOString(),aDate);
          let _b = b.date.split("-");
          let bDate = new Date(
              parseInt(_b[0]),
              parseInt(_b[1]) - 1,
              parseInt(_b[2])
          ).getTime();
          let diff = bDate - aDate;
          return diff;
      });

      //this.changeDetectorRef.detectChanges();
      this.upcomingFixtures = this.upcomingFixtures.reverse();

      this.oldfixtures = this.fixtures.filter((i) => {
          let _a = i.date.split("-");

          let date = new Date(
              parseInt(_a[0]),
              parseInt(_a[1]) - 1,
              parseInt(_a[2])
          ).getTime();

          let today = new Date();
          today.setDate(today.getDate() - 1);

          return date - today.getTime() < 0;
      });

      // console.log("Sorted Fixtures", this.upcomingFixtures);
    }

    reloadScore(){
      this.rotating = true;
      firebase
      .firestore()
      .collection(this.firebaseService.collections.fixtures)
      .get()
      .then((docs) => {
        this.manipulateFixtureDocs(docs);
        this.rotating = false;
      });

    }
}
