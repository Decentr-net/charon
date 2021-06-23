import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-menu-page',
  templateUrl: './user-menu-page.component.html',
  styleUrls: ['./user-menu-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
