import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'a[app-authorized-layout-navigation-link]',
  templateUrl: './authorized-layout-navigation-link.component.html',
  styleUrls: ['./authorized-layout-navigation-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedLayoutNavigationLinkComponent implements AfterViewInit {
  @Input() public dot: boolean = true;

  @ViewChild('titleContainer', { static: true }) public titleContainer: ElementRef<HTMLElement>;

  public title: string;

  public ngAfterViewInit(): void {
    this.title = this.titleContainer.nativeElement.innerText;
  }
}
