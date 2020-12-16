import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ToolbarStateService } from '@shared/services/toolbar-state';

@Component({
  selector: 'app-toolbar-toggle',
  templateUrl: './toolbar-toggle.component.html',
  styleUrls: ['./toolbar-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarToggleComponent implements OnInit {
  public toolbarEnabledState$: Observable<boolean>;

  constructor(private toolbarStateService: ToolbarStateService) { }

  ngOnInit(): void {
    this.toolbarEnabledState$ = this.toolbarStateService.getEnabledState();
  }

  public onToolbarEnabledStateChange(state: boolean): void {
    this.toolbarStateService.setEnabledState(state);
  }
}
