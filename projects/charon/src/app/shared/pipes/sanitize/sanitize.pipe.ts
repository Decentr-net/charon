import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

interface SanitizeMap {
  html: SafeHtml;
  resourceUrl: SafeResourceUrl;
  script: SafeScript;
  style: SafeStyle;
  url: SafeUrl;
}

@Pipe({
  name: 'appSanitize',
})
export class SanitizePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {
  }

  public transform<T extends keyof SanitizeMap>(target: string, type: T): SanitizeMap[T] {
    switch (type) {
      case 'html':
        return this.domSanitizer.bypassSecurityTrustHtml(target);
      case 'resourceUrl':
        return this.domSanitizer.bypassSecurityTrustResourceUrl(target);
      case 'script':
        return this.domSanitizer.bypassSecurityTrustScript(target);
      case 'style':
        return this.domSanitizer.bypassSecurityTrustStyle(target);
      case 'url':
        return this.domSanitizer.bypassSecurityTrustUrl(target);
    }
  }
}
