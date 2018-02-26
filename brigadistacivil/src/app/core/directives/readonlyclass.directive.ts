import {Directive,ElementRef,Renderer,Input} from '@angular/core';

@Directive({
    selector:'[readonlyDirective]'
})
export class ReadOnlyDirective{

    constructor(private el:ElementRef,private render:Renderer){  }

    @Input('readonlyClass') readonlyClass: boolean;

    ngOnInit(){
      if(this.readonlyClass) this.changeClass('readonlyInput');
    }

    private changeClass(value: string) {
          this.render.setElementClass(this.el.nativeElement, value, true);
    }
}
