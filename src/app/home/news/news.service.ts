import { Injectable } from "@angular/core";

import { FirebaseService } from "~/services/firebase.service";


@Injectable({
    providedIn: "root"
})

export class NewsService{

    
    private news = new Array <NewsItem>(
        {
            image: "https://cdn.ghanasoccernet.com/2020/10/LEGON-cities.jpg",
            title: "Players are geared up and ready for the next update",
            date: "18th October 2020"
        },
        {
            image: "https://cdn.ghanasoccernet.com/2020/10/LEGON-cities.jpg",
            title: "Players are geared up and ready for the next update",
            date: "18th October 2020"
        }
        );

        constructor(){
            
        }

        getNewsItems(): Array<NewsItem>{
            return this.news;
        }

        


}

export class NewsItem{
    constructor(public image:string, public title:string, public date:string ){}
}
