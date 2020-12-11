import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-hub-post-time',
  templateUrl: './hub-post-time.component.html',
  styleUrls: ['./hub-post-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostTimeComponent {
  @Input() time: number;
  @Input() isUnix: boolean = true;

  public get timestamp(): number {
    return this.time * (this.isUnix ? 1000 : 1);
  }
}
