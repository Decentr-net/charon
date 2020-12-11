import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCutHtmlImages',
})
export class CutHtmlImagesPipe implements PipeTransform {
  public transform(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;

    const images = div.querySelectorAll('img');
    images.forEach(image => image.remove());

    return div.innerHTML;
  }
}
