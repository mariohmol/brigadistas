import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { GeneralService } from './general.service';
import { CoreModule } from '../core/core.module';
import { HttpClient } from '@angular/common/http';


export class TranslateHttpLoader implements TranslateLoader {
    constructor(private http: HttpClient, private prefix: string = 'assets/i18n/', private suffix: string = '.json') { }
    /**
     * Gets the translations from the server
     * @param lang
     * @returns {any}
     */
    public getTranslation(lang: string): any {
        return this.http.get(`${this.prefix}${lang}${this.suffix}`);
    }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        ReactiveFormsModule, FormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory, // (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
    ],
    exports: [
        TranslateModule,

    ],
    entryComponents: [

    ],
    providers: [
        GeneralService
    ]
})
export class AppSharedModule {
}
