import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    selector: 'app-file-upload',
    template: `<input type="file" [multiple]="multiple" #fileInput >`
    // , styleUrls: ['app/hero-details.component.css']
})
// tslint:disable-next-line:component-class-suffix
export class FileUploadDirective {
    @Input() multiple = false;
    @Input() url: String = 'http://your.upload.url';
    @ViewChild('fileInput') inputEl: ElementRef;

    constructor(private http: Http) { }

    upload(cb) {
        const inputEl: HTMLInputElement = this.inputEl.nativeElement;
        const fileCount: number = inputEl.files.length;
        const data = [];
        if (fileCount > 0) { // a file was selected
            for (let i = 0; i < fileCount; i++) {
                data.push(inputEl.files.item(i));
            }
            cb(data);
        }
    }

    uploadUrl(data) {
        const formData = new FormData();
        data.forEach(d => {
            formData.append('file[]', d);
        });
        this.http.post(this.url.toString(), formData);
    }
}
