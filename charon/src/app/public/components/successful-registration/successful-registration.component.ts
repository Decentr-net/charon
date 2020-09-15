import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-successful-registration',
  templateUrl: './successful-registration.component.html',
  styleUrls: ['./successful-registration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessfulRegistrationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
