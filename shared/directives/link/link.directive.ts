import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { addHttpsToUrl, URL_EXP } from '@shared/utils/url';

@Directive({
  selector: 'a[appLink]',
})
export class LinkDirective {
  @Input() public set appLink(link: string) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'text', link || '-');
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'target');
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'href');

    if (new RegExp(URL_EXP).test(link)) {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'target', '_blank');
      this.renderer.setAttribute(this.elementRef.nativeElement, 'href', addHttpsToUrl(link));
    }
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
  }
}
