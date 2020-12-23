import { Pipe, PipeTransform } from '@angular/core';

import { getFirstParagraph } from '../../utils/html';

@Pipe({
  name: 'appFirstParagraph',
})
export class FirstParagraphPipe implements PipeTransform {
  public transform(html: string): string {
    return getFirstParagraph(html);
  }
}
