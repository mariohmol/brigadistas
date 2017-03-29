import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'file-upload',
    template: `<input type="file" [multiple]="multiple" #fileInput >`
    // , styleUrls: ['app/hero-details.component.css']
})
export class FileUploadComponent {
    @Input() multiple: boolean = false;
    @Input() url: String = 'http://your.upload.url';
    @ViewChild('fileInput') inputEl: ElementRef;

    constructor(private http: Http) {}

    upload(cb) {
        let inputEl: HTMLInputElement = this.inputEl.nativeElement;
        let fileCount: number = inputEl.files.length;
        let data=[];
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                data.push(inputEl.files.item(i));
            }
            cb(data);
        }
    }

    uploadUrl(data){
        let formData = new FormData();
        data.forEach(d=>{
            formData.append('file[]',d);
        })
        this.http.post(this.url.toString(), formData);
    }
}