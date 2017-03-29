import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UploadService {
    public progress;
    public progressObserver;

  constructor () {
    this.progress = Observable.create(observer => {
        this.progressObserver = observer
    }).share();
  }

  public makeFileRequest (url: string, params: string[], files: File[]): Observable<any> {
    return Observable.create(observer => {
        let formData: FormData = new FormData(),
            xhr: XMLHttpRequest = new XMLHttpRequest();
        if(files.length==1){
            formData.append("uploads", files[0], files[0].name);
        }else{
            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }
        }
        

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);
                }
            }
        };

        xhr.upload.onprogress = (event) => {
            this.progress = Math.round(event.loaded / event.total * 100);

            if(this.progressObserver) this.progressObserver.next(this.progress);
        };

        xhr.open('POST', url, true);
        xhr.send(formData);
    });
  }
}