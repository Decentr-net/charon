import { Pipe, PipeTransform } from '@angular/core';

import { createFragmentWrappedContainer } from '../../utils/html';
import { getLowestLevelChildNodes } from '../../utils/html/children';

@Pipe({
  name: 'appTextContent',
})
export class TextContentPipe implements PipeTransform {
  public transform(html: string): string {
    const container = createFragmentWrappedContainer();
    container.innerHTML = html;

    const textNodes = getLowestLevelChildNodes(container)
      .filter((node, index) => !!node.textContent || (node as Element).tagName.toLowerCase() === 'br' && index);

    container.innerHTML = '';
    container.append(...textNodes);

    return container.innerHTML;
  }
}
