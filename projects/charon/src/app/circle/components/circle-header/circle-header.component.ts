import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-circle-header',
  templateUrl: './circle-header.component.html',
  styleUrls: ['./circle-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleHeaderComponent {
  constructor(
    h: HttpClient,
    domSanitizer: DomSanitizer,
    matIconRegistry: MatIconRegistry,
  ) {
    // h.get('assets/images/icons/notification.svg').subscribe(console.log);
    matIconRegistry.addSvgIcon(
      'notification1',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/images/icons/notification.svg'),
    );
  }
}
