import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portal-page',
  templateUrl: './portal-page.component.html',
  styleUrls: ['./portal-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalPageComponent {
}
