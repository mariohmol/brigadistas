import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from "../../providers/index";

@Component({
    selector: 'select-user',
    template: `
            <ion-searchbar #textInput (ionInput)="getItems($event)"></ion-searchbar>
            <ion-list inset>
                 <button ion-item *ngFor="let user of users" (click)="selectItem(user)">
                    <ion-avatar item-left   >
                     <img [src]="user.image" *ngIf="user && user.image">
                     <img src="/assets/img/bg.jpg" *ngIf="!user || !user.image">
                    </ion-avatar>
                    <h2>{{user.name}}</h2>
                    <p>{{user.bio}}</p>
                </button>
            </ion-list>
        `
    // , styleUrls: ['app/hero-details.component.css'] [multiple]="multiple"
})
export class SelectUser {
    @Input() multiple: boolean = false;
    @Input() select: Function;
    @ViewChild('textInput') inputEl: ElementRef;
    private users: any;
    private user: any;

    constructor(private http: Http, private userService: UserService) {

       this.search(null);
    }

    search(text){
        if(text==null && this.inputEl) text = this.inputEl.nativeElement;
        this.userService.findUser(text).then(u=>{
            this.users=u;
        });
    }

    getItems(ev: any) {
        this.users=[];
        let val = ev.target.value;
        this.search(val);
    }

    selectItem(u){
        this.user=u;
        if(this.select) this.select(u);
    }

}