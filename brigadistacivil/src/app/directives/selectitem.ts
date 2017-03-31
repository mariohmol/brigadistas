import { Component, ElementRef, Input, ViewChild, SimpleChanges } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from "../../providers/index";

@Component({
    selector: 'select-item',
    template: `
            <ion-searchbar #textInput (ionInput)="getItems($event)"></ion-searchbar>
            <ion-list class="tabcontent">
                 <button ion-item *ngFor="let item of filterItems" (click)="selectItem(item)">
                    <ion-avatar item-left   >
                     <img [src]="item[image]" *ngIf="item && item[image]">
                     <img src="/assets/img/bg.jpg" *ngIf="!item || !item[image]">
                    </ion-avatar>
                    <h2>{{item[title]}}</h2>
                    <p>{{item[subtitle]}}</p>
                </button>
            </ion-list>
        `
    // , styleUrls: ['app/hero-details.component.css'] [multiple]="multiple"
})
export class SelectItem {
    @Input() multiple: boolean = false;
    @Input() readonly: boolean = false;
    @Input() select: Function;
    @Input() search: Function;
    @ViewChild('textInput') inputEl: ElementRef;
    @Input() items: any;
    private item: any;
    private filterItems;
    @Input() title: any = "name";
    @Input() subtitle: any = "bio";
    @Input() image: any = "image";


    constructor(private http: Http, private userService: UserService) {
        
    }

    ngOnInit() {
        this.filterItems = this.items;
        if(!this.search) this.search=this.searchDefault;
        if(!this.readonly) this.search(null);
    }

    ngOnChanges(changes: SimpleChanges) {
        this.ngOnInit();
    }

    searchDefault(text){
        if(text==null && this.inputEl) text = this.inputEl.nativeElement;
        this.userService.findUser(text).then(u=>{
            this.filterItems = this.items=u;
        });
    }

    getItems(ev: any) {
        this.filterItems = this.items=[];
        let val = ev.target.value;
        if(this.readonly) this.filterItems = this.items.filter(c=>{ 
            return c[this.title].includes(val) || c[this.subtitle].includes(val);
        });
        else this.search(val);
    }

    selectItem(u){
        this.item=u;
        if(this.select) this.select(u);
    }

}