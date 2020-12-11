import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { NewsItem, NewsService } from "./news.service";
import * as firebase from "nativescript-plugin-firebase/app";
import { FirebaseService } from "~/services/firebase.service";
import { News } from "~/models/news";
import { Page } from "@nativescript/core";

@Component({
    templateUrl: "./news.component.html",
    styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit {
    //news: Array<NewsItem>;
    undef = undefined;
    constructor(private _newsService: NewsService,
      private changeDetectorRef:ChangeDetectorRef,
      private firebaseService:FirebaseService,
      private page:Page) {
      }

    init = `[
    {
      "image": "https://images.daznservices.com/di/library/GOAL/29/1c/asamoah-gyan-northeast-united-isl-6_151sv0n4u5fvx1wg81hzhqryag.jpg?t=-2053897137&amp;quality=60&amp;w=1200",
      "headline": "Legon Cities react to Ghana striker's speculated million-dollar signing fee ",
      "content": "The Royals shed light on a reported sum they supposedly paid to secure the 34-year-old's services Legon Cities communications director Kwame Dwomoh Agyemang has revealed the figures, reported by local media as the signing fee for veteran Ghana striker Asamoah Gyan, are not true. Gyan joined The Royals on a one-year contract on domestic Transfer Deadline Day on Saturday, amid claims of a deal worth $1 million.He settled for Legon after failing to reach an agreement with local giants Asante Kotoko whom he had publicly declared love for and stated a desire to wear the colours of the club.",
      "date": "5th November 2020",
      "views": 20
    },
    {
      "image": "https://cdn.ghanafa.org/2020/03/GPL-Referees-lemon.jpg",
      "headline": "APPROVED LIST OF PREMIER LEAGUE REFEREES FOR 2020/2021 SEASON",
      "content": "The Ghana Football Association is pleased to announce the list of referees for the 2020/2021 Premier League season following medical and fitness test.The list is for 40 Premier League referees and 40 Premier League Assistant referees. There is a list of 10 Referees and 10 Assistant Referees who will be officiating in the Division One League but will also serve as support for the Premier League when needed. These support referees, will officiate in the Premier League when any Referee drops from the list of 40 Premier League Referees due to either disciplinary, performance, ethical or medical issue. These selected referees will take charge of the 306 Premier League matches in the upcoming season. Attached is the full list of Referees and Assistant Referees.",
      "date": "5th November 2020",
      "views": 20
    },
    {
      "image": "https://cdn.ghanafa.org/2020/10/clb.jpg",
      "headline": "CLUB LICENSING BOARD ANNOUNCE DECISIONS AFTER INSPECTION OF PROPOSED PREMIER LEAGUE VENUES",
      "content": "The Club Licensing Board of the Ghana Football Association (GFA), has announced decisions after inspecting the venues proposed by Premier League clubs for the 2020/2021 League season. Eight (8) Clubs were granted conditional approvals with the Board, set to re-inspect (ten) 10 venues before granting them approvals. Click below for the decision of the Club Licensing Board after the first inspection of Premier League Venues for the 2020/21 season:",
      "date": "1st November 2020",
      "views": 20
    },
    {
      "image": "",
      "headline": "CLUB MEDIA OFFICERS, VENUE MEDIA OFFICERS END ONE-DAY SEMINAR",
      "content": "The Ghana Football Association (GFA) on Thursday, October 29, 2020 organized a one-day training seminar for Premier League Club Media Officers (CMOs) and Venue Media Officers (VMOs) at the GFA Headquarters in Accra. The training was aimed at giving the VMOs and CMOs a better understanding of media operations before, during and after matches in the 2020/2021 League season.  GFA General Secretary, Prosper Harrison Addo (Esq.), Integrity Officer Obed Tuffuor, Vice Chairman of the Premier League Management Committee, Jesse Agyepong and CAF Media Officer, Kofi Sumaila Addae were among the speakers at the seminar.",
      "date": "2nd November 2020",
      "views": 20
    },
    {
      "image": "https://cdn.ghanafa.org/2020/03/A5DA7F51-66FB-4B14-8DC1-C951F44FB5F9.jpeg",
      "headline": "WAFA HANDED HEAVY DEFEAT BY LEGON CITIES",
      "content": "The Royals ended their winless streak in the matchday 13 encounter with a brace from Cephas Doku and goals from Ebenezer Nii Addy and Fafali Yusif while Sampson Agyapong got a consolation goal for WAFA. Doku got the opener in the 25th minute after brilliantly connecting to Latif Abubakar’s pass. Sampson Agyapong, however, restored parity with minutes to the end of the first half, curling in a free-kick from the edge of the box.The Legon City boys returned from the break all fired up and were rewarded with a goal two minutes into the second half after Ebenezer Addy’s strike beat Prince Bilson in post for WAFA.Cities were not done as Doku got his second of the day after the hour mark before another brilliant move resulted in Yusif’s goal. This is Legon Cities’ third win of the season, a result that sees them now tally 16 points from 13 matches. For WAFA, this disappointing result is only their second defeat of the season but could see them displaced from 6th position on the league log when the remaining seven games of matchday 13 are cleared on Saturday and Sunday. Earlier in the day, Asante Kotoko travelled to beat Karela United 1-0 at Akoon Park.",
      "date": "6th March 2020",
      "views": 20
    }
  ]
  `;

    news : News[] = [];

    tappedNewsIndex ;
    
    ngOnInit(): void {
        //this.news = this._newsService.getNewsItems();
        //console.log(this.news)
        global['route'] = "home";
        this.tappedNewsIndex = this.undef;
        firebase.firestore().collection(this.firebaseService.collections.news).get().then(docs=>{
            this.news = []
            docs.forEach(doc=>{
                this.news.push(<News>doc.data());
            })
        })
    }

    uploadInitial() {
        let initiaNews = <[]>JSON.parse(this.init);
        for (let news of initiaNews) {
            firebase.firestore()
                .collection(this.firebaseService.collections.news)
                .add(news)
                .then((response) => {
                    console.log(response);
                });
        }
    }

    newsTapped(event){
      if (!event) return;
      this.tappedNewsIndex = event.index;

      console.log("Tapped News Index",this.tappedNewsIndex);
    }

    goBack(){
      this.tappedNewsIndex = this.undef;
      this.changeDetectorRef.detectChanges();
    }
}
