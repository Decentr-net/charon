import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDelete } from '@shared/svg-icons';

@Component({
  selector: 'app-hub-post-delete-button',
  templateUrl: './hub-post-delete-button.component.html',
  styleUrls: ['./hub-post-delete-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostDeleteButtonComponent {
  @Output() public delete: EventEmitter<void> = new EventEmitter();

  @HostBinding('class.mod-is-expanded')
  public get getIsExpanded(): boolean {
    return this.isExpanded;
  }

  @HostBinding('class.mod-is-collapsed')
  public get getIsCollapsed(): boolean {
    return !this.isExpanded;
  }

  @HostListener('click', ['$event'])
  public onHostClick(event: Event): void {
    if (!this.isExpanded) {
      this.toggleButton(event);
    }
  }

  private isExpanded: boolean = false;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDelete,
    ]);
  }

  public toggleButton(event: Event): void {
    this.isExpanded = !this.isExpanded;
    event.stopPropagation();
  }

  public onClickDelete(): void {
    this.delete.emit();
  }
}
