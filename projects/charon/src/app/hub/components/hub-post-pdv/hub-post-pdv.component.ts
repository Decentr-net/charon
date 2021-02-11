import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-post-pdv',
  templateUrl: './hub-post-pdv.component.html',
  styleUrls: ['./hub-post-pdv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostPdvComponent {
  @Input() public pdv: number;
}
