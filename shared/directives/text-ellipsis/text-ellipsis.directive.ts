import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appTextEllipsis]'
})
export class TextEllipsisDirective {
  @HostBinding('class.text-ellipsis') public hasHostClass = true;
}
