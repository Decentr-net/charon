import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDelete } from '@shared/svg-icons/delete';

@Component({
  selector: 'app-hub-post-delete-button',
  templateUrl: './hub-post-delete-button.component.html',
  styleUrls: ['./hub-post-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostDeleteButtonComponent {
  @Output() public delete: EventEmitter<void> = new EventEmitter();

  public isExpanded: boolean = false;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDelete,
    ]);
  }

  public toggle(event: Event): void {
    this.isExpanded = !this.isExpanded;
    event.stopPropagation();
  }

  public onDelete(): void {
    this.delete.emit();
  }
}
