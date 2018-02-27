import { Directive, ElementRef, Renderer, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appReadonlyDirective]'
})
export class ReadOnlyDirective implements OnInit {

    constructor(private el: ElementRef, private render: Renderer) { }

    @Input('readonlyClass') readonlyClass: boolean;

    ngOnInit() {
        if (this.readonlyClass) {
            this.changeClass('readonlyInput');
        }
    }

    private changeClass(value: string) {
        this.render.setElementClass(this.el.nativeElement, value, true);
    }
}
